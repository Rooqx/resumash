import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { randomBytes, randomUUID } from "node:crypto";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import {
  TAILOR_QUEUE, completeJob, enqueueTailoring, getAuthorizedJob,
  jobQueue, jobRedis, readJobResult, readJobInput, updateJob,
} from "./tailor-job-store";

const redisURL = process.env.REDIS_URI;
const suite = redisURL ? describe : describe.skip;

suite("anonymous job lifecycle with real Redis", () => {
  let worker: Worker;
  let calls = 0;
  const id = randomUUID();
  const token = randomBytes(32).toString("hex");
  const wrongToken = randomBytes(32).toString("hex");

  beforeAll(async () => {
    worker = new Worker(TAILOR_QUEUE, async job => {
      calls++;
      await updateJob(job.id!, "processing");
      await completeJob(job.id!, { inputValue: { fullName: "Example" }, fields: {}, requiresReview: true });
    }, { connection: new IORedis(redisURL!, { maxRetriesPerRequest: null }), concurrency: 1 });
    await worker.waitUntilReady();
  });
  afterAll(async () => {
    await worker.close();
    await jobQueue().close();
    await jobRedis().del(`resumash:tailor:job:${id}`, `resumash:tailor:result:${id}`, `resumash:tailor:input:${id}`);
    await jobRedis().quit();
  });

  it("queues once, securely retrieves the result and deduplicates an accepted replay", async () => {
    await enqueueTailoring(id, token, "Synthetic resume", "Synthetic role description");
    expect((await readJobInput(id))?.sourceText).toBe("Synthetic resume");
    const queuedJob = await jobQueue().getJob(id);
    expect(JSON.stringify(queuedJob?.data)).not.toContain("Synthetic resume");
    await enqueueTailoring(id, token, "Synthetic resume", "Synthetic role description");
    await expect(getAuthorizedJob(id, wrongToken)).rejects.toMatchObject({ statusCode: 404 });

    let record = await getAuthorizedJob(id, token);
    for (let n = 0; n < 100 && record?.status !== "completed"; n++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      record = await getAuthorizedJob(id, token);
    }
    expect(record?.status).toBe("completed");
    expect(await readJobResult(id)).toMatchObject({ requiresReview: true });
    // A late failure transition must not undo the completed result.
    expect(await updateJob(id, "failed", "This is too late")).toBe(false);
    expect((await getAuthorizedJob(id, token))?.status).toBe("completed");
    await enqueueTailoring(id, token, "Different text", "Different role");
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(calls).toBe(1);
  }, 10_000);
});
