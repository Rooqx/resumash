import { Router, type Request } from "express";

import {
  generateResumePDF,
  uploadResume,
} from "../controllers/resuem.controller";
import uploadMiddleware from "../middlewares/uploads.middleware";
import { submitTailoringJob, tailoringJobStatus } from "../controllers/tailor-job.controller";
import { getAuthorizedJob, validateCredentials } from "../modules/tailoring/tailor-job-store";
import { tailorRateLimit, aiRateLimit } from "../middlewares/tailor-rate-limit";
import { questionnaireSchema } from "../modules/resume/ai-builder.schema";
import { buildResumeFromQuestionnaire } from "../modules/resume/ai-builder.service";
import { logger } from "../utils/logger";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
const resumeRouter = Router();

const upload = uploadMiddleware();
// Check for a previously accepted idempotency key before charging quota again.
// Replay never starts another model request, including after the first response was lost.
resumeRouter.post("/tailor", asyncHandler(async (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  const id = req.header("X-Resume-Job-Id");
  const token = req.header("X-Resume-Job-Token");
  validateCredentials(id, token);
  const existing = await getAuthorizedJob(id, token!);
  if (existing) {
    res.status(202).json({ jobId: id, status: existing.status });
    return;
  }
  next();
}), tailorRateLimit, upload, submitTailoringJob);
resumeRouter.get("/tailor/:jobId", tailoringJobStatus);

// Keep the original synchronous route for existing integrations.
resumeRouter.post("/upload", tailorRateLimit, upload, uploadResume);

/** Generate an editable, review-required resume draft from a short questionnaire. */
resumeRouter.post("/ai-build", aiRateLimit("builder", 10), async (req, res, next) => {
  try {
    const input = questionnaireSchema.safeParse(req.body);
    if (!input.success) {
      res.status(400).json({ message: "Invalid questionnaire answers", issues: input.error.flatten() });
      return;
    }
    const data = await buildResumeFromQuestionnaire(input.data);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

resumeRouter.post("/download-resume", async (req, res) => {
  // React PDF now runs entirely in the browser. Old Playwright rendering is
  // disabled by default to prevent unnecessary server resource consumption.
  if (process.env.ENABLE_LEGACY_PDF_EXPORT !== "true") {
    res.status(410).json({ message: "Use browser-side PDF export instead." });
    return;
  }
  try {
    const { inputValue, fields, tagFields, templateId } = req.body;
    const selectedTemplate = ["classic", "modern", "executive"].includes(templateId) ? templateId : "modern";
    if (!inputValue || !fields) {
      throw new AppError("Missing resume data", 400);
    }

    const zustandState = { inputValue, fields, tagFields };
    const pdf = await generateResumePDF(zustandState, selectedTemplate);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
    logger.info("Resume Downloaded");

    res.send(pdf);
  } catch (err) {
    logger.error("resume.legacy_pdf.failed", { event:"resume.legacy_pdf.failed" });
    res.status(500).send("Failed to generate PDF");
  }
});
export default resumeRouter;
