import { Worker } from "bullmq";
import IORedis from "ioredis";
import { REDIS_URI } from "../configs/env.configs";
import { logger } from "../utils/logger";
import { TAILOR_QUEUE, completeJob, updateJob, jobRedis, readJobInput, deleteJobInput } from "../modules/tailoring/tailor-job-store";
import { tailorResumeFromText } from "../modules/tailoring/tailor.service";

if (!REDIS_URI) throw new Error("REDIS_URI is required for the tailoring worker");

/**
 * Run as a separate process: node dist/workers/tailor.worker.js
 * No automatic AI retries: a stalled paid request must not be charged twice.
 */
const worker = new Worker<Record<string, never>>(
  TAILOR_QUEUE,
  async job => {
    // Ignore expired jobs even if the queue retained them during downtime.
    const record = await jobRedis().get(`resumash:tailor:job:${job.id}`);
    if (!record) return;
    const input = await readJobInput(job.id!);
    if (!input) {
      await updateJob(job.id!, "failed", "Tailoring input expired before processing.");
      return;
    }
    if (!await updateJob(job.id!, "processing")) return;
    try {
      const result = await tailorResumeFromText(input.sourceText, input.jobDescription, input.optimizationMode ?? "conservative", job.id);
      await completeJob(job.id!, result);
      logger.info("tailor.job.completed", { event: "tailor.job.completed", jobId: job.id });
    } catch (error) {
      // Never expose candidate text or raw provider errors via job status.
      await updateJob(job.id!, "failed", "Resume generation failed. Please try again.");
      logger.error("tailor.job.failed", { event: "tailor.job.failed", jobId: job.id,
        errorType: error instanceof Error ? error.constructor.name : "UnknownError" });
      throw error;
    } finally {
      // Remove candidate data immediately after work, even on provider failure.
      await deleteJobInput(job.id!);
    }
  },
  {
    connection: new IORedis(REDIS_URI, { maxRetriesPerRequest: null }),
    concurrency: 2,
    maxStalledCount: 0,
    lockDuration: 360_000,
  },
);
worker.on("error", () => logger.error("tailor.worker.error", { event: "tailor.worker.error" }));
logger.info("tailor.worker.started", { event: "tailor.worker.started" });
async function shutdown() {
  await worker.close();
  await jobRedis().quit();
  process.exit(0);
}
process.once("SIGTERM", () => { void shutdown(); });
process.once("SIGINT", () => { void shutdown(); });
