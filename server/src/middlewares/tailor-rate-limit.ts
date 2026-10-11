import { createHash } from "node:crypto";
import { createClient } from "redis";
import type { RequestHandler } from "express";

const WINDOW_SECONDS = 5 * 60 * 60;


/**
 * Shared Redis client for quota accounting. A missing Redis URL is a
 * configuration error: production requests must not bypass the quota.
 */
const redisUrl = process.env.REDIS_URI;
let redis: ReturnType<typeof createClient> | undefined;
function getRedis() {
  if (!redisUrl) throw new Error("REDIS_URI is required for AI rate limiting");
  if (!redis) {
    redis = createClient({ url: redisUrl });
    redis.on("error", () => { /* Connection failures are handled by requests. */ });
  }
  return redis;
}

/**
 * Executes one atomic fixed-window quota update.
 * KEYS[1] identifies a hashed IP; ARGV[1] is the five-hour TTL.
 * INCR and EXPIRE must run together to avoid unbounded counters.
 */
const QUOTA_SCRIPT = `
local used = redis.call('INCR', KEYS[1])
if used == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
local ttl = redis.call('TTL', KEYS[1])
return {used, ttl}
`;

/**
 * Enforces at most ten attempted tailoring operations per trusted IP
 * per window. Middleware must execute BEFORE multipart upload processing.
 * Quota storage failure returns 503 rather than allowing costly requests.
 */
export function aiRateLimit(bucket: "tailor" | "builder" | "letter", requestLimit: number): RequestHandler {
 return async (req, res, next) => {
  try {
    const ip = req.ip;
    if (!ip) {
      res.status(400).json({ message: "Unable to identify request origin" });
      return;
    }
    const client = getRedis();
    if (!client.isOpen) await client.connect();
    const key = "resumash:ai:" + bucket + ":" + createHash("sha256").update(ip).digest("hex");
    const result = await client.eval(QUOTA_SCRIPT, {
      keys: [key],
      arguments: [String(WINDOW_SECONDS)],
    });
    if (!Array.isArray(result)) throw new Error("Unexpected quota result");
    const used = Number(result[0]);
    const ttl = Math.max(0, Number(result[1]));
    if (!Number.isFinite(used) || !Number.isFinite(ttl)) throw new Error("Invalid quota result");
    res.setHeader("RateLimit-Limit", String(requestLimit));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, requestLimit - used)));
    res.setHeader("RateLimit-Reset", String(ttl));
    if (used > requestLimit) {
      res.setHeader("Retry-After", String(ttl));
      res.status(429).json({ message: "Resume tailoring limit reached. Try again later.", retryAfterSeconds: ttl });
      return;
    }
    next();
  } catch {
    res.status(503).json({ message: "Resume tailoring is temporarily unavailable." });
  }
 };
}

/** Strict limit requested for resume tailoring: 10/IP per five-hour window. */
export const tailorRateLimit = aiRateLimit("tailor", 10);
