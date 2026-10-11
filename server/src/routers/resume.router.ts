import { Router, type Request } from "express";

import {
  generateResumePDF,
  uploadResume,
} from "../controllers/resuem.controller";
import uploadMiddleware from "../middlewares/uploads.middleware";
import { logger } from "../utils/logger";
import { AppError } from "../middlewares/error.middleware";
const resumeRouter = Router();

const upload = await uploadMiddleware();
resumeRouter.post("/upload", upload.single("resume"), uploadResume);

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
