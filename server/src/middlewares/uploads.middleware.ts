import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError, asyncHandler } from "./error.middleware";

export default function uploadMiddleware() {
  // Ensure uploads folder exists
  try {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    if (!uploadDir) new AppError("Upload directory not found", 400);

    // Multer config
    const storage = multer.diskStorage({
      destination: (req: Request, file: any, cb: any) => cb(null, uploadDir),
      filename: (req: Request, file: any, cb: any) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    });
    if (!storage) new AppError("Storage not found", 400);

    const fileFilter = (req: Request, file: any, cb: any) => {
      const allowed = [".pdf", ".doc", ".docx"];
      const ext = path.extname(file.originalname).toLowerCase();
      allowed.includes(ext)
        ? cb(null, true)
        : cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    };
    if (!fileFilter) new AppError("File filter not found", 400);

    const upload = multer({ storage, fileFilter });

    if (!upload) new AppError("Upload not found", 400);
    return upload;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
