import { createHash, timingSafeEqual } from "node:crypto";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { REDIS_URI } from "../../configs/env.configs";
import { AppError } from "../../middlewares/error.middleware";

/** Anonymous capability grants expire 24 hours after submission. */
export const JOB_TTL_SECONDS = 24 * 60 * 60;
export const TAILOR_QUEUE = "resume-tailoring";
export const JOB_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const TOKEN_PATTERN = /^[0-9a-f]{64}$/i;
export type JobStatus = "queued" | "processing" | "completed" | "failed";
export interface JobRecord {
  tokenHash: string;
  status: JobStatus;
  createdAt: number;
  updatedAt: number;
  error?: string;
}
const key = (id: string) => `resumash:tailor:job:${id}`;
const resultKey = (id: string) => `resumash:tailor:result:${id}`;

let redis: IORedis | undefined;
let queue: Queue | undefined;
function url(): string {
  if (!REDIS_URI) throw new AppError("Tailoring service is not configured", 503);
  return REDIS_URI;
}
/** API connection fails fast; the worker maintains its own retrying connection. */
export function jobRedis(): IORedis {
  if (!redis) {
    redis = new IORedis(url(), { maxRetriesPerRequest: 1, connectTimeout: 10_000 });
    redis.on("error", () => { /* Failures surface through individual commands. */ });
  }
  return redis;
}
export function jobQueue(): Queue {
  if (!queue) queue = new Queue(TAILOR_QUEUE, {
    connection: jobRedis(),
    defaultJobOptions: { attempts: 1, removeOnComplete: true, removeOnFail: true },
  });
  return queue;
}
function digest(secret: string): string {
  return createHash("sha256").update(secret, "utf8").digest("hex");
}
function matches(record: JobRecord, token: string): boolean {
  const actual = Buffer.from(record.tokenHash, "hex");
  const candidate = Buffer.from(digest(token), "hex");
  return actual.length === candidate.length && timingSafeEqual(actual, candidate);
}
export function validateCredentials(id: unknown, token: unknown): asserts id is string {
  if (typeof id !== "string" || !JOB_ID_PATTERN.test(id) ||
      typeof token !== "string" || !TOKEN_PATTERN.test(token)) {
    throw new AppError("Invalid tailoring job credentials", 400);
  }
}
/** The token is never written to Redis, provider logs, or URL parameters. */
export async function getAuthorizedJob(id: string, token: string): Promise<JobRecord | null> {
  const raw = await jobRedis().get(key(id));
  if (!raw) return null;
  const record = JSON.parse(raw) as JobRecord;
  if (!matches(record, token)) throw new AppError("Tailoring job not found", 404);
  return record;
}

/** Reserve a random job ID; a repeat with the same token is safe and free of AI work. */
export async function enqueueTailoring(
  id: string, token: string, sourceText: string, jobDescription: string,
): Promise<void> {
  const now = Date.now();
  const record: JobRecord = { tokenHash: digest(token), status: "queued", createdAt: now, updatedAt: now };
  const inserted = await jobRedis().set(key(id), JSON.stringify(record), "EX", JOB_TTL_SECONDS, "NX");
  if (inserted !== "OK") {
    // The same submission ID with a different token is not an authorized replay.
    const existing = await getAuthorizedJob(id, token);
    if (existing) return;
    throw new AppError("Tailoring job expired; submit a new request", 410);
  }
  try {
    await jobQueue().add("tailor", { sourceText, jobDescription }, { jobId: id });
  } catch {
    await jobRedis().del(key(id));
    throw new AppError("Could not queue resume tailoring", 503);
  }
}

/** Preserve the original TTL: status updates must never extend access lifetime. */
export async function updateJob(id: string, status: JobStatus, error?: string): Promise<boolean> {
  const raw = await jobRedis().get(key(id));
  if (!raw) return false;
  const record = JSON.parse(raw) as JobRecord;
  return (await jobRedis().set(key(id),
    JSON.stringify({ ...record, status, updatedAt: Date.now(), ...(error ? { error } : {}) }),
    "XX", "KEEPTTL")) === "OK";
}
export async function completeJob(id: string, result: unknown): Promise<void> {
  // The job may have expired during a long wait. Don't retain private data beyond expiry.
  const ttl = await jobRedis().ttl(key(id));
  if (ttl <= 0) return;
  await jobRedis().set(resultKey(id), JSON.stringify(result), "EX", ttl);
  const updated = await updateJob(id, "completed");
  if (!updated) await jobRedis().del(resultKey(id));
}
export async function readJobResult(id: string): Promise<unknown | null> {
  const value = await jobRedis().get(resultKey(id));
  return value ? JSON.parse(value) : null;
}
