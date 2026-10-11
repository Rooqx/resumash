import { z } from 'zod'

/** Canonical editor data. AI review metadata is intentionally separate. */
export const tailoredResumeSchema = z.object({
 inputValue: z.record(z.string()),
 fields: z.record(z.array(z.record(z.unknown()))),
 tagFields: z.record(z.object({
  tags: z.array(z.string()),
  input: z.string().default(''),
  suggestions: z.array(z.string()).default([]),
 })).optional(),
})
export type TailoredResume = z.infer<typeof tailoredResumeSchema>

const reviewSuggestionSchema = z.object({
 section: z.string(),
 sourceQuote: z.string(),
 original: z.string(),
 proposed: z.string(),
 reason: z.string(),
 priority: z.enum(['high','medium','low']),
 changeType: z.enum(['rewrite','emphasize','reorder','clarify']),
 requirementId: z.string(),
 evidenceLevel: z.enum(['direct','related','ambiguous']),
 requiresConfirmation: z.boolean(),
 requiresReview: z.boolean().optional(),
})
const requirementSchema = z.object({
 id: z.string(),
 requirement: z.string(),
 importance: z.enum(['essential','preferred','contextual']),
 evidence: z.enum(['direct','related','ambiguous','missing']),
 sourceQuote: z.string(),
})
export const tailoringResponseSchema = tailoredResumeSchema.extend({
 suggestions: z.array(reviewSuggestionSchema).default([]),
 requirements: z.array(requirementSchema).default([]),
 missingRequirements: z.array(z.string()).default([]),
 clarificationQuestions: z.array(z.object({
  requirementId: z.string(),
  question: z.string(),
  reason: z.string(),
 })).default([]),
 writingNotes: z.array(z.string()).default([]),
 requiresReview: z.boolean().default(true),
})
export type TailoringResponse = z.infer<typeof tailoringResponseSchema>

export const builderResponseSchema = tailoredResumeSchema.extend({
 clarificationQuestions: z.array(z.object({
  area: z.enum(['experience','project','education','skills','general']),
  index: z.number().nullable(),
  question: z.string(),
  reason: z.string(),
 })).default([]),
 writingNotes: z.array(z.string()).default([]),
 requiresReview: z.boolean().default(true),
 reviewMessage: z.string().optional(),
})
export type BuilderResponse = z.infer<typeof builderResponseSchema>
