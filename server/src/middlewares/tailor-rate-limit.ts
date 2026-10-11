import { createHash } from "node:crypto";
import type { RequestHandler } from "express";
import { createClient } from "redis";

/** Every quota window lasts five hours from the first counted request. */
const WINDOW_SECONDS = 5 * 60 * 60;

/** Redis is shared across processes, so restarting Express does not reset quotas. */
let redisClient: ReturnType<typeof createClient> | undefined;
let redisConnection: Promise<unknown> | undefined;

function getRedisClient() {
  if (!process.env.REDIS_URI) {
    throw new Error("REDIS_URI is required for AI rate limiting");
  }
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URI });
    // The request path reports a safe HTTP 503 if Redis is unavailable.
    redisClient.on("error", () => undefined);
  }
  return redisClient;
}

/**
 * Reuse the same initial Redis connection promise across concurrent requests.
 * Without this, simultaneous first requests can call connect() twice.
 */
async function connectedRedis() {
  const client = getRedisClient();
  if (client.isReady) return client;
  if (!redisConnection) {
    redisConnection = client.connect().finally(() => {
      redisConnection = undefined;
    });
  }
  await redisConnection;
  return client;
}

/**
 * Atomic quota counter using an expiring Redis key.
 *
 * KEYS[1]: hashed client IP scoped to one AI feature.
 * ARGV[1]: number of seconds in the fixed quota window.
 *
 * INCR and EXPIRE must execute atomically to avoid a missing expiry
 * or exceeding quotas during concurrent requests.
 */
const QUOTA_SCRIPT = `
local used = redis.call('INCR', KEYS[1])
if used == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
local ttl = redis.call('TTL', KEYS[1])
return {used, ttl}
`;

/**
 * Create a per-IP quota for one expensive AI action.
 *
 * @param bucket - Independent counter namespace. One feature's usage
 *   does not consume the allowance of another feature.
 * @param requestLimit - Maximum requests permitted during each 5-hour
 *   window, including attempted or invalid requests.
 *
 * IMPORTANT: configure Express trust proxy only for known proxy hops.
 * Untrusted forwarded headers must never define the client IP.
 */
export function aiRateLimit(
  bucket: "tailor" | "builder" | "letter",
  requestLimit: number,
): RequestHandler {
  if (!Number.isInteger(requestLimit) || requestLimit < 1) {
    throw new Error("AI rate limit must be a positive integer");
  }

  return async (req, res, next) => {
    try {
      const clientIp = req.ip;
      if (!clientIp) {
        res.status(400).json({ message: "Unable to determine request origin." });
        return;
      }

      const client = await connectedRedis();
      // Hashing removes human-readable IPs from Redis key names.
      const hashedIp = createHash("sha256").update(clientIp).digest("hex");
      const quotaKey = `resumash:quota:${bucket}:${hashedIp}`;

      const evaluation = await client.eval(QUOTA_SCRIPT, {
        keys: [quotaKey],
        arguments: [String(WINDOW_SECONDS)],
      });
      if (!Array.isArray(evaluation)) throw new Error("Invalid quota response");

      const used = Number(evaluation[0]);
      const secondsUntilReset = Number(evaluation[1]);
      if (!Number.isSafeInteger(used) || used < 1 ||
          !Number.isSafeInteger(secondsUntilReset) || secondsUntilReset < 0) {
        throw new Error("Invalid quota counter");
      }

      res.setHeader("RateLimit-Limit", String(requestLimit));
      res.setHeader("RateLimit-Remaining", String(Math.max(0, requestLimit - used)));
      res.setHeader("RateLimit-Reset", String(secondsUntilReset));

      if (used > requestLimit) {
        res.setHeader("Retry-After", String(secondsUntilReset));
        res.status(429).json({
          message: "AI usage limit reached. Try again after your quota resets.",
          retryAfterSeconds: secondsUntilReset,
        });
        return;
      }

      next();
    } catch {
      // Fail closed. A Redis outage must not become unlimited AI spending.
      res.status(503).json({ message: "AI generation is temporarily unavailable." });
    }
  };
}

/** Exact product requirement: ten tailoring attempts per IP every five hours. */
export const tailorRateLimit = aiRateLimit("tailor", 10);
