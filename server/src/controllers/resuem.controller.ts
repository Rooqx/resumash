import { tailorInputSchema } from "../modules/resume/resume.schema";
import { tailorResume } from "../modules/tailoring/tailor.service";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";
import { chromium } from "playwright";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import { ResponseHelper } from "../utils/responseHelper";
import { logger } from "../utils/logger";
import {
  ENV,
  FRONTEND_DEVELOPMENT_URL,
  FRONTEND_PRODUCTION_URL,
} from "../configs/env.configs";

export const uploadResume = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = tailorInputSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError("Invalid job description (20–20,000 characters required)", 400);
    const resume = req.file?.buffer;
    // Check bytes: client-provided MIME and extension are not trustworthy.
    if (!resume || resume.subarray(0, 5).toString("ascii") !== "%PDF-") {
      throw new AppError("Upload a valid PDF resume", 400);
    }
    // AI input and parsing remain in memory: no public upload paths.
    const result = await tailorResume(resume, parsed.data.jobDescription);
    return ResponseHelper.success(res, { data: result }, "Resume tailored successfully");
  }
);

export async function generateResumePDF(zustandState: any, template: "classic" | "modern" | "executive" = "modern") {
  try {
    

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
      `${FRONTEND_URL}/rxsme?template=${encodeURIComponent(template)}&data=${encodeURIComponent(
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
    logger.error("resume.pdf.generation_failed", { event:"resume.pdf.generation_failed" });
  }
}
