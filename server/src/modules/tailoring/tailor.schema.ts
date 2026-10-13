import { z } from "zod";
import { resumeOutputSchema } from "../resume/resume.schema";
import { MAX_TAILORING_WRITING_NOTES, capValidWritingNotes } from "./writing-notes";

export const tailoringResultSchema = z.object({
  resume: resumeOutputSchema,
  suggestions: z.array(z.object({
    section: z.string().max(80),
    target: z.object({
      section: z.enum(["inputValue", "fields", "tagFields"]),
      key: z.string().max(60),
      index: z.number().int().min(0).optional(),
      field: z.string().max(60).optional(),
    }).strict(),
    sourceQuote: z.string().min(8).max(500),
    original: z.string().max(750),
    proposed: z.string().max(750),
    reason: z.string().min(5).max(500),
    priority: z.enum(["high", "medium", "low"]),
    changeType: z.enum(["rewrite", "emphasize", "reorder", "clarify"]),
    requirementId: z.string().max(60),
    evidenceLevel: z.enum(["direct", "related", "ambiguous"]),
    requiresConfirmation: z.boolean(),
  })).max(15).default([]),
  requirements: z.array(z.object({
    id: z.string().min(1).max(60),
    requirement: z.string().min(4).max(250),
    importance: z.enum(["essential", "preferred", "contextual"]),
    evidence: z.enum(["direct", "related", "ambiguous", "missing"]),
    sourceQuote: z.string().max(500),
  })).max(25).default([]),
  missingRequirements: z.array(z.string().max(250)).max(15).default([]),
  clarificationQuestions: z.array(z.object({
    requirementId: z.string().max(60),
    question: z.string().min(12).max(350),
    reason: z.string().min(5).max(250),
  })).max(8).default([]),
  // Model-generated notes are optional guidance, not resume evidence.
  // Trim only a surplus of structurally valid notes; invalid content still fails.
  writingNotes: z.preprocess(
    capValidWritingNotes,
    z.array(z.string().max(250)).max(MAX_TAILORING_WRITING_NOTES).default([]),
  ),
}).strict();
