import multer from "multer";
import type { RequestHandler } from "express";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;

/**
 * Private in-memory PDF upload. No private resume is placed under a
 * publicly exposed static directory or retained on disk by Multer.
 * One in-flight request uses at most 10 MiB for the uploaded PDF.
 */
export default function uploadMiddleware(): RequestHandler {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_RESUME_BYTES, files: 1, fields: 1 },
    fileFilter: (_request, file, callback) => {
      if (file.mimetype !== "application/pdf" || !file.originalname.toLowerCase().endsWith(".pdf")) {
        callback(new Error("Only PDF resumes are currently supported"));
        return;
      }
      callback(null, true);
    },
  }).single("resume");
}
