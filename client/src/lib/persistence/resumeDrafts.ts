import { z } from 'zod'
import { tailoringResponseSchema } from '@/features/resume-tailor/schemas'

const TAILOR_KEY = 'resumash:tailor:v1'
const BUILDER_VIEW_KEY = 'resumash:builder:view:v1'
const DB_NAME = 'resumash-private-documents'
const FILE_KEY = 'tailor-upload'
const MAX_UPLOAD = 10 * 1024 * 1024

const tailorDraftSchema = z.object({
  version: z.literal(1),
  jobDescription: z.string().max(20000),
  result: tailoringResponseSchema.nullable(),
  approved: z.boolean(),
  acceptedEdits: z.array(z.number().int().nonnegative()).max(100),
  view: z.enum(['original', 'tailored', 'comparison']),
})
export type TailorDraft = z.infer<typeof tailorDraftSchema>

/**
 * Resume drafts contain personal details and live only in this browser.
 * Use versioned keys and validate values before restoring; never assume a
 * previous app version saved data with the current shape.
 */
export function restoreTailorDraft(): TailorDraft | null {
  try {
    const raw = localStorage.getItem(TAILOR_KEY)
    return raw ? tailorDraftSchema.parse(JSON.parse(raw)) : null
  } catch { return null }
}
export function saveTailorDraft(value: TailorDraft): boolean {
  try {
    localStorage.setItem(TAILOR_KEY, JSON.stringify(value))
    return true
  } catch { return false }
}
export function clearTailorDraft(): void {
  try { localStorage.removeItem(TAILOR_KEY) } catch { /* Storage might be disabled */ }
}
export function restoreBuilderView(): { active: number; template: string } | null {
  try {
    const raw = localStorage.getItem(BUILDER_VIEW_KEY)
    if (!raw) return null
    return z.object({ active: z.number().int().min(0).max(5), template: z.string() }).parse(JSON.parse(raw))
  } catch { return null }
}
export function saveBuilderView(view: { active: number; template: string }): boolean {
  try { localStorage.setItem(BUILDER_VIEW_KEY, JSON.stringify(view)); return true }
  catch { return false }
}
export function clearBuilderDraft(): void {
  for (const key of ['resumash:builder:inputs:v1', 'resumash:builder:fields:v1',
    'resumash:builder:tags:v1', 'resumash:builder:questionnaire:v1', BUILDER_VIEW_KEY]) {
    try { localStorage.removeItem(key) } catch { /* Storage might be disabled */ }
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB not available')); return }
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('files')) request.result.createObjectStore('files')
    }
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
/**
 * IndexedDB requests can succeed before the containing transaction commits.
 * Resolve only once tx.oncomplete confirms durable persistence.
 */
async function withFileStore<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase()
  try {
    return await new Promise<T>((resolve, reject) => {
      let value: T
      const tx = db.transaction('files', mode)
      const request = callback(tx.objectStore('files'))
      request.onsuccess = () => { value = request.result }
      request.onerror = () => reject(request.error)
      tx.oncomplete = () => resolve(value)
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'))
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'))
    })
  } finally { db.close() }
}

/**
 * Serialize mutations so an older async save cannot commit after a later clear.
 * Reads also enter the queue, preventing restoration from observing half-written data.
 */
let fileOperations: Promise<unknown> = Promise.resolve()
function enqueueFileOperation<T>(operation: () => Promise<T>): Promise<T> {
  const result=fileOperations.then(operation,operation)
  fileOperations=result.then(()=>undefined,()=>undefined)
  return result
}

/** IndexedDB stores the original PDF Blob separately from localStorage metadata. */
export async function saveUploadedResume(file: File): Promise<void> {
  if (file.size > MAX_UPLOAD || file.type !== 'application/pdf') throw new Error('Only PDF files up to 10 MB are supported')
  await enqueueFileOperation(()=>withFileStore('readwrite', store => store.put({ blob: file, name: file.name, savedAt: Date.now() }, FILE_KEY)))
}
export async function restoreUploadedResume(): Promise<File | null> {
  const stored = await enqueueFileOperation(()=>withFileStore<{ blob: Blob; name: string } | undefined>('readonly', store => store.get(FILE_KEY)))
  if (!stored?.blob || stored.blob.size > MAX_UPLOAD) return null
  return new File([stored.blob], stored.name || 'resume.pdf', { type: 'application/pdf' })
}
export async function clearUploadedResume(): Promise<void> {
  await enqueueFileOperation(()=>withFileStore('readwrite', store => store.delete(FILE_KEY)))
}

/**
 * Recovery capability: IndexedDB avoids putting bearer secrets in links,
 * browser history or long-lived draft JSON. Anyone with the token can read
 * this job's result, so do not include it in telemetry or URLs.
 */
export interface TailorJobCredentials {
  jobId: string
  token: string
  submittedAt: number
}
const JOB_KEY = 'tailor-active-job'
const savedJobSchema = z.object({
  jobId: z.string().uuid(),
  token: z.string().regex(/^[a-f0-9]{64}$/),
  submittedAt: z.number().int().positive(),
})
export async function saveActiveTailorJob(job: TailorJobCredentials): Promise<void> {
  savedJobSchema.parse(job)
  await enqueueFileOperation(() => withFileStore('readwrite', store => store.put(job, JOB_KEY)))
}
export async function restoreActiveTailorJob(): Promise<TailorJobCredentials | null> {
  const item = await enqueueFileOperation(() => withFileStore<unknown>('readonly', store => store.get(JOB_KEY)))
  const parsed = savedJobSchema.safeParse(item)
  if (!parsed.success || Date.now() - parsed.data.submittedAt >= 24 * 60 * 60 * 1000) {
    await clearActiveTailorJob()
    return null
  }
  return parsed.data
}
export async function clearActiveTailorJob(): Promise<void> {
  await enqueueFileOperation(() => withFileStore('readwrite', store => store.delete(JOB_KEY)))
}
