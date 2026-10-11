import { z } from "zod";
import { resumeOutputSchema } from "../resume/resume.schema";

export const tailoringResultSchema = z.object({
  resume: resumeOutputSchema,
  suggestions: z.array(z.object({
    section: z.string().max(80),
    sourceQuote: z.string().min(8).max(500),
    original: z.string().max(750),
    proposed: z.string().max(750),
    reason: z.string().min(5).max(500),
  })).max(15).default([]),
  missingRequirements: z.array(z.string().max(250)).max(15).default([]),
}).strict();
