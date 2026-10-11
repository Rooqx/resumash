import { z } from 'zod'
import { tailoringResponseSchema, type TailoringResponse } from '@/features/resume-tailor/schemas'

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
    'resumash:builder:tags:v1', BUILDER_VIEW_KEY]) {
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
async function withFileStore<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase()
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction('files', mode)
      const request = callback(tx.objectStore('files'))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
      tx.onerror = () => reject(tx.error)
    })
  } finally { db.close() }
}

/** IndexedDB stores the original PDF Blob separately from localStorage metadata. */
export async function saveUploadedResume(file: File): Promise<void> {
  if (file.size > MAX_UPLOAD || file.type !== 'application/pdf') throw new Error('Only PDF files up to 10 MB are supported')
  await withFileStore('readwrite', store => store.put({ blob: file, name: file.name, savedAt: Date.now() }, FILE_KEY))
}
export async function restoreUploadedResume(): Promise<File | null> {
  const stored = await withFileStore<{ blob: Blob; name: string } | undefined>('readonly', store => store.get(FILE_KEY))
  if (!stored?.blob || stored.blob.size > MAX_UPLOAD) return null
  return new File([stored.blob], stored.name || 'resume.pdf', { type: 'application/pdf' })
}
export async function clearUploadedResume(): Promise<void> {
  await withFileStore('readwrite', store => store.delete(FILE_KEY))
}
