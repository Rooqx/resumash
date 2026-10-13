import type { Request, Response } from "express";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import { tailorInputSchema } from "../modules/resume/resume.schema";
import { parseResumePdf } from "../modules/resume/parse-pdf";
import {
  enqueueTailoring, getAuthorizedJob, jobQueue, readJobResult, updateJob, validateCredentials,
} from "../modules/tailoring/tailor-job-store";

/**
 * Client creates a random 256-bit token BEFORE upload and stores it locally.
 * Replaying the same submission after an ambiguous network failure cannot
 * create a second paid AI job; Redis stores only its SHA-256 digest.
 */
export const submitTailoringJob = asyncHandler(async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  const id = req.header("X-Resume-Job-Id");
  const token = req.header("X-Resume-Job-Token");
  validateCredentials(id, token);
  const input = tailorInputSchema.safeParse(req.body);
  if (!input.success) throw new AppError("Invalid job description (20–20,000 characters required)", 400);
  const file = req.file?.buffer;
  if (!file || file.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new AppError("Upload a valid PDF resume", 400);
  }
  // Fast path for a replay: no repeated PDF parsing or provider invocation.
  const previous = await getAuthorizedJob(id, token!);
  if (!previous) {
    const sourceText = await parseResumePdf(file);
    await enqueueTailoring(id, token!, sourceText, input.data.jobDescription);
  }
  res.status(202).json({ jobId: id, status: previous?.status ?? "queued" });
});

export const tailoringJobStatus = asyncHandler(async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  const id = req.params.jobId;
  const token = req.header("X-Resume-Job-Token");
  validateCredentials(id, token);
  let record = await getAuthorizedJob(id!, token!);
  if (!record) throw new AppError("Tailoring job expired or not found", 404);

  // If a process crashed and BullMQ discarded a stalled job, avoid infinite
  // polling. A short grace period covers a job being freshly enqueued.
  if (record.status === "queued" || record.status === "processing") {
    const queued = await jobQueue().getJob(id!);
    if (!queued && Date.now() - record.updatedAt > 60_000) {
      await updateJob(id!, "failed", "This job was interrupted. Please submit it again.");
      record = { ...record, status: "failed", error: "This job was interrupted. Please submit it again." };
    }
  }
  if (record.status === "completed") {
    const result = await readJobResult(id!);
    if (!result) throw new AppError("Tailoring result has expired", 410);
    res.json({ jobId: id, status: "completed", result });
    return;
  }
  res.json({ jobId: id, status: record.status, ...(record.error ? { error: record.error } : {}) });
});
