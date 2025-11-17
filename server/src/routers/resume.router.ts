import { Router, type Request } from "express";

import {
  generateResumePDF,
  uploadResume,
} from "../controllers/resuem.controller";
import uploadMiddleware from "../middlewares/uploads.middleware";
import { logger } from "../utils/logger";
const resumeRouter = Router();

const upload = await uploadMiddleware();
resumeRouter.post("/upload", upload.single("resume"), uploadResume);

resumeRouter.get("/download-resume", async (req, res) => {
  try {
    const pdf = await generateResumePDF();

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
