import axios from 'axios'
import type { TailorJobCredentials } from '@/lib/persistence/resumeDrafts'

type JobStatus = 'queued' | 'processing' | 'completed' | 'failed'
export interface TailoringJobResponse {
  jobId: string
  status: JobStatus
  result?: unknown
  error?: string
}
const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_DEVELOPMENT_BACKEND_URL

function url(): string {
  if (!backendUrl) throw new Error('Resume service is not configured.')
  return `${backendUrl}/api/v1/resumes/tailor`
}

/** Generate and persist these BEFORE sending the upload, so a lost 202 is recoverable. */
export function createTailorJobCredentials(): TailorJobCredentials {
  const secret = crypto.getRandomValues(new Uint8Array(32))
  return {
    jobId: crypto.randomUUID(),
    token: Array.from(secret, byte => byte.toString(16).padStart(2, '0')).join(''),
    submittedAt: Date.now(),
  }
}

export async function submitTailoringJob({
  jobDescription, file, credentials,
}: {
  jobDescription: string
  file: File
  credentials: TailorJobCredentials
}): Promise<TailoringJobResponse> {
  if (!jobDescription.trim()) throw new Error('Please enter a job description.')
  const form = new FormData()
  form.append('jobDescription', jobDescription)
  form.append('resume', file)
  const response = await axios.post<TailoringJobResponse>(url(), form, {
    timeout: 45_000, // Only includes upload and PDF parsing, not model inference.
    headers: { 'X-Resume-Job-Id': credentials.jobId, 'X-Resume-Job-Token': credentials.token },
  })
  return response.data
}

export async function getTailoringJob(credentials: TailorJobCredentials): Promise<TailoringJobResponse> {
  const response = await axios.get<TailoringJobResponse>(`${url()}/${credentials.jobId}`, {
    timeout: 15_000,
    headers: { 'X-Resume-Job-Token': credentials.token },
  })
  return response.data
}
