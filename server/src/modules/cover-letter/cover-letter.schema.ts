import { z } from "zod";

export const coverLetterInputSchema = z.object({
  applicantName: z.string().trim().min(2).max(120),
  targetRole: z.string().trim().min(2).max(120),
  company: z.string().trim().min(1).max(160),
  jobDescription: z.string().trim().min(20).max(20_000),
  experience: z.string().trim().min(20).max(12_000),
  tone: z.enum(["professional", "conversational", "enthusiastic", "concise"]).default("professional"),
}).strict();

export const coverLetterDraftSchema = z.object({
  letter: z.string().min(100).max(6_000),
}).strict();
