import { z } from "zod";

/**
 * Short optional questionnaire for users starting without a resume.
 * Work history is optional so students and career changers are supported.
 */
export const questionnaireSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  location: z.string().trim().max(160).optional().default(""),
  targetRole: z.string().trim().min(2).max(120),
  careerLevel: z.enum(["student", "entry", "mid", "senior"]).default("entry"),
  skills: z.array(z.string().trim().min(1).max(100)).max(40).default([]),
  experience: z.array(z.object({
    company: z.string().trim().min(1).max(120),
    position: z.string().trim().min(1).max(120),
    startDate: z.string().trim().max(40).default(""),
    endDate: z.string().trim().max(40).default(""),
    responsibilities: z.string().trim().min(10).max(2_000),
  })).max(10).default([]),
  education: z.array(z.object({
    institution: z.string().trim().min(1).max(160),
    degree: z.string().trim().max(150).default(""),
    dates: z.string().trim().max(70).default(""),
  })).max(10).default([]),
  projects: z.array(z.object({
    name: z.string().trim().min(1).max(160),
    description: z.string().trim().min(5).max(1_500),
  })).max(10).default([]),
  additionalInfo: z.string().trim().max(3_000).default(""),
}).strict();

export type Questionnaire = z.infer<typeof questionnaireSchema>;

export const resumeDraftSchema = z.object({
  summary: z.string().max(1200),
  experienceBullets: z.array(z.object({
    index: z.number().int().min(0),
    bullets: z.array(z.string().min(8).max(350)).max(5),
  })).max(10),
  projectBullets: z.array(z.object({
    index: z.number().int().min(0),
    bullets: z.array(z.string().min(8).max(350)).max(4),
  })).max(10).default([]),
  clarificationQuestions: z.array(z.object({
    area: z.enum(["experience", "project", "education", "skills", "general"]),
    index: z.number().int().min(0).nullable(),
    question: z.string().min(12).max(350),
    reason: z.string().min(5).max(250),
  })).max(10).default([]),
  writingNotes: z.array(z.string().max(250)).max(8).default([]),
}).strict();
