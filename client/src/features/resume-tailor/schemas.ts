import { z } from 'zod'

// Existing server payload; keep permissive section records until the legacy editor is migrated.
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
