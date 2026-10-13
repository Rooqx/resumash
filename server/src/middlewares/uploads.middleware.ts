import multer from "multer";
import type { RequestHandler, ErrorRequestHandler } from "express";
import { AppError } from "./error.middleware";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;

/**
 * Private in-memory PDF upload. No private resume is placed under a
 * publicly exposed static directory or retained on disk by Multer.
 * One in-flight request uses at most 10 MiB for the uploaded PDF.
 * Tailoring sends jobDescription, optimizationMode and one resume PDF.
 * Limiting fields and files separately is sufficient; a separate parts limit
 * can reject an otherwise valid multipart message at the exact boundary.
 */
export default function uploadMiddleware(): RequestHandler {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_RESUME_BYTES, files: 1, fields: 2 },
    fileFilter: (_request, file, callback) => {
      if (file.mimetype !== "application/pdf" || !file.originalname.toLowerCase().endsWith(".pdf")) {
        callback(new AppError("Only PDF resumes are currently supported", 415));
        return;
      }
      callback(null, true);
    },
  }).single("resume");
}


// Keep multipart-limit errors actionable and distinguishable from schema errors.
export const uploadErrorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (!(error instanceof multer.MulterError)) {
    next(error);
    return;
  }
  const message = error.code === "LIMIT_FILE_SIZE"
    ? "Resume file is too large (maximum 10 MB)."
    : error.code === "LIMIT_FIELD_COUNT" || error.code === "LIMIT_PART_COUNT"
      ? "Invalid resume upload: send one PDF and at most two text fields (jobDescription and optimizationMode)."
      : error.code === "LIMIT_UNEXPECTED_FILE"
        ? "Invalid resume upload: only one PDF file named resume is accepted."
        : "Invalid resume upload.";
  response.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ message });
};
