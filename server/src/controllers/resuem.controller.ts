import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import { ResponseHelper } from "../utils/responseHelper";
import Job from "../services/job.service";

export const uploadResume = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jd = "";
    if (!req.file) {
      throw new AppError("No file added", 400);
    }
    const fileUrl = await `uploads/${req?.file?.filename}`;
    console.log("fileUrl", fileUrl);
    const newResume = new Job(jd, fileUrl);

    const data = await newResume.extractResumeBlocks();
    if (!data) {
      throw new AppError("Data not added", 404);
    }
    console.log("file uploaded");

    return ResponseHelper.success(
      res,
      {
        /* fileName: req?.file?.filename,
        filePath: fileUrl,*/
        data,
      },
      "File uploaded successfully!"
    );
  }
);
