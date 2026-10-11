import { Router, type Request } from "express";

import {
  generateResumePDF,
  uploadResume,
} from "../controllers/resuem.controller";
import uploadMiddleware from "../middlewares/uploads.middleware";
import { tailorRateLimit, aiRateLimit } from "../middlewares/tailor-rate-limit";
import { questionnaireSchema } from "../modules/resume/ai-builder.schema";
import { buildResumeFromQuestionnaire } from "../modules/resume/ai-builder.service";
import { logger } from "../utils/logger";
import { AppError } from "../middlewares/error.middleware";
const resumeRouter = Router();

const upload = uploadMiddleware();
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
    logger.error("PDF generation failed:", err);
    res.status(500).send("Failed to generate PDF");
  }
});
export default resumeRouter;
