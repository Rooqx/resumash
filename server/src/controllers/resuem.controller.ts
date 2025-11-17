import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import { ResponseHelper } from "../utils/responseHelper";
import Job from "../services/job.service";
import { logger } from "../utils/logger";

export const uploadResume = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      throw new AppError("No body added", 400);
    }
    const { jobDescription } = req.body;

    if (!jobDescription)
      throw new AppError("Job description missing in the request body", 400);

    //Stringy Job description best practice for ai prompting
    const formattedJobDesc = JSON.stringify(jobDescription);

    if (!req.file) {
      throw new AppError("No file added", 400);
    }

    //Get file path
    const fileUrl = await `uploads/${req?.file?.filename}`;

    const newResume = new Job(formattedJobDesc, fileUrl);

    const data = await newResume.returnTailorResume();
    if (!data) {
      throw new AppError("Data not added", 404);
    }
    logger.info("Resume Tailor Successful");
    fs.rm(fileUrl, { recursive: true, force: true }, (err) => {
      if (err) throw err;
      logger.info(`File ${fileUrl} deleted successfully`);
    });
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

import puppeteer from "puppeteer";

export async function generateResumePDF() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    // Visit your Vite React page
    await page.goto("http://localhost:3000/rxsme", {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
  } catch (err) {
    logger.error("PDF generation failed:", err);
  }
}
