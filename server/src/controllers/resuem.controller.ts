import fs from "fs";
import type { Request, Response, NextFunction } from "express";
import { chromium } from "playwright";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import { ResponseHelper } from "../utils/responseHelper";
import Job from "../services/job.service";
import { logger } from "../utils/logger";
import {
  ENV,
  FRONTEND_DEVELOPMENT_URL,
  FRONTEND_PRODUCTION_URL,
} from "../configs/env.configs";

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

export async function generateResumePDF(zustandState: any) {
  try {
    console.log("initializing pdf download");

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const FRONTEND_URL =
      ENV === "development"
        ? FRONTEND_DEVELOPMENT_URL
        : FRONTEND_PRODUCTION_URL;
    // Visit your Vite React page
    await page.goto(
      `${FRONTEND_URL}/rxsme?data=${encodeURIComponent(
        JSON.stringify(zustandState)
      )}`,
      {
        waitUntil: "networkidle",
      }
    );

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    await browser.close();
    return pdfBuffer;
  } catch (err) {
    logger.error("PDF generation failed:", err);
  }
}
