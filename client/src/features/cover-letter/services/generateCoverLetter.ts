import { z } from 'zod'

export type LetterTone = 'Professional' | 'Conversational' | 'Enthusiastic' | 'Concise'

export interface CoverLetterRequest {
  applicantName: string
  targetRole: string
  company: string
  jobDescription: string
  experience: string
  tone: LetterTone
}

/** Runtime-checked response from the Fireworks-backed Express API. */
const responseSchema = z.object({
  data: z.object({
    letter: z.string().min(100),
    requiresReview: z.boolean().optional(),
  }),
})

/**
 * Generate a real AI-assisted letter instead of the old local string template.
 * Text remains editable; no generated claims are automatically certified.
 */
export async function generateCoverLetter(input: CoverLetterRequest): Promise<string> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_DEVELOPMENT_BACKEND_URL
  if (!backendUrl) throw new Error('AI service is not configured.')

  const response = await fetch(`${backendUrl}/api/v1/cover-letters/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      applicantName: input.applicantName,
      targetRole: input.targetRole,
      company: input.company,
      jobDescription: input.jobDescription,
      experience: input.experience,
      tone: input.tone.toLowerCase(),
    }),
    signal: AbortSignal.timeout(70_000),
  })

  if (response.status === 429) {
    throw new Error('You have reached your cover letter generation limit. Try again later.')
  }
  if (!response.ok) {
    throw new Error('Cover letter generation is unavailable. Please try again later.')
  }

  const raw: unknown = await response.json()
  const parsed = responseSchema.safeParse(raw)
  if (!parsed.success) throw new Error('The server returned an invalid cover letter.')
  return parsed.data.data.letter
}
