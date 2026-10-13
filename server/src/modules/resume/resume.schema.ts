import { z } from "zod";
import { optimizationModeSchema } from "../tailoring/optimization-mode";

/** Constraints apply to the text extracted from untrusted uploads. */
export const tailorInputSchema = z.object({
  jobDescription: z.string().trim().min(20).max(20_000),
  optimizationMode: optimizationModeSchema,
});

export const resumeOutputSchema = z.object({
  inputValue: z.record(z.string()),
  fields: z.record(z.array(z.record(z.unknown()))),
  tagFields: z.record(z.object({
    tags: z.array(z.string().min(1).max(350)).max(80),
    input: z.string().default(""),
    suggestions: z.array(z.string()).default([]),
  })).optional(),
});
