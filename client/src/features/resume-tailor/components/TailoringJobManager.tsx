import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { GripVertical, LoaderCircle, Minus, Maximize2, FileCheck2 } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { createTailorJobCredentials, getTailoringJob, submitTailoringJob } from '@/lib/serverActions/tailorResume'
import { clearActiveTailorJob, restoreActiveTailorJob, restoreTailorDraft, saveActiveTailorJob, saveTailorDraft, type TailorJobCredentials } from '@/lib/persistence/resumeDrafts'
import { tailoringResponseSchema, type TailoringResponse } from '@/features/resume-tailor/schemas'

type JobState = 'queued' | 'processing' | 'completed' | 'failed' | undefined
type JobContext = {
  activeJob: TailorJobCredentials | null
  restoring: boolean
  submitting: boolean
  status: JobState
  result: TailoringResponse | null
  error: string | null
  start: (file: File, jobDescription: string) => Promise<void>
  forget: () => Promise<void>
}
const Context = createContext<JobContext | null>(null)
const WIDGET_KEY = 'resumash:tailor:widget:v1'

function savedMinimized() {
  try { return localStorage.getItem(WIDGET_KEY) === 'minimized' } catch { return false }
}
function persistMinimized(value: boolean) {
  try { localStorage.setItem(WIDGET_KEY, value ? 'minimized' : 'expanded') } catch { /* Optional visual preference */ }
}

/** Lives above route outlets: background polling must survive page navigation. */
export function TailoringJobProvider({ children }: { children: ReactNode }) {
  const [activeJob, setActiveJob] = useState<TailorJobCredentials | null>(null)
  const [restoring, setRestoring] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<TailoringResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [minimized, setMinimized] = useState(savedMinimized)
  const notified = useRef<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    void restoreActiveTailorJob()
      .then(job => { if (mounted) setActiveJob(job) })
      .catch(() => { if (mounted) setError('Job recovery is unavailable in this browser.') })
      .finally(() => { if (mounted) setRestoring(false) })
    return () => { mounted = false }
  }, [])

  const statusQuery = useQuery({
    queryKey: ['resume-tailor-job', activeJob?.jobId],
    queryFn: () => getTailoringJob(activeJob!),
    enabled: Boolean(activeJob) && !submitting,
    retry: false,
    refetchInterval: query => {
      const status = query.state.data?.status
      return status === 'completed' || status === 'failed' ? false : 3000
    },
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    if (!activeJob || statusQuery.data?.jobId !== activeJob.jobId) return
    const data = statusQuery.data
    if (data.status !== 'completed' && data.status !== 'failed') return
    if (notified.current === activeJob.jobId) return
    notified.current = activeJob.jobId

    if (data.status === 'completed') {
      const parsed = tailoringResponseSchema.safeParse(data.result)
      if (parsed.success) {
        const draft = restoreTailorDraft()
        const saved = saveTailorDraft({
          version: 1,
          jobDescription: draft?.jobDescription ?? '',
          result: parsed.data,
          approved: false,
          acceptedEdits: [],
          view: 'tailored',
        })
        if (!saved) toast.error('Could not save this result locally. Please review it before closing the tab.')
        setResult(parsed.data)
        setError(null)
        setMinimized(true)
        persistMinimized(true)
        // Give the user a chance to remain in the current workspace.
        let stay = false
        toast.success('Your tailored resume is ready!', {
          duration: 7500,
          action: { label: 'Stay here', onClick: () => { stay = true } },
        })
        if (window.location.pathname !== '/tailor-resume') {
          window.setTimeout(() => {
            const focused = document.activeElement
            const editing = focused instanceof HTMLElement &&
              Boolean(focused.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))
            if (!stay && !editing) void navigate({ to: '/tailor-resume' })
          }, 4000)
        }
      } else {
        setError('The server returned an invalid resume. Your job can no longer be recovered.')
        toast.error('The server returned an invalid resume.')
      }
    } else {
      setError(data.error || 'Resume tailoring failed. Please retry.')
      toast.error(data.error || 'Resume tailoring failed.')
    }
    setActiveJob(null)
    void clearActiveTailorJob().catch(() => setError('Unable to clear the expired local job reference.'))
  }, [activeJob, statusQuery.data, navigate])

  useEffect(() => {
    if (!activeJob || !axios.isAxiosError(statusQuery.error)) return
    const code = statusQuery.error.response?.status
    if (code === 404 && Date.now() - activeJob.submittedAt < 90_000) return
    if (code === 404 || code === 410 || code === 400 || code === 403) {
      setError('Your previous tailoring job is no longer available. You can submit another.')
      setActiveJob(null)
      void clearActiveTailorJob().catch(() => undefined)
    }
  }, [activeJob, statusQuery.error])

  const start = async (file: File, jobDescription: string) => {
    if (restoring || submitting || activeJob) throw new Error('A tailoring job is already in progress.')
    const credentials = createTailorJobCredentials()
    setSubmitting(true)
    setResult(null)
    setError(null)
    notified.current = null
    try {
      // Persist the capability BEFORE uploading. Do not start an unrecoverable job.
      await saveActiveTailorJob(credentials)
      setActiveJob(credentials)
      const response = await submitTailoringJob({ file, jobDescription, credentials })
      if (response.jobId !== credentials.jobId || !['queued', 'processing', 'completed'].includes(response.status)) {
        throw new Error('Unexpected tailoring acceptance response.')
      }
      setMinimized(false)
      persistMinimized(false)
    } catch (cause) {
      if (axios.isAxiosError(cause) && !cause.response) {
        // An ambiguous network failure may mean the server accepted the request.
        setMinimized(true)
        persistMinimized(true)
        setError('Connection interrupted. Checking whether your job was accepted…')
      } else {
        setActiveJob(null)
        await clearActiveTailorJob().catch(() => undefined)
        const message = axios.isAxiosError(cause) && typeof cause.response?.data?.message === 'string'
          ? cause.response.data.message : cause instanceof Error ? cause.message : 'Could not start tailoring.'
        setError(message)
        toast.error(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const forget = async () => {
    setActiveJob(null)
    setError(null)
    await clearActiveTailorJob()
    // Forgetting a browser reference cannot cancel an already queued server job.
  }

  const value: JobContext = {
    activeJob, restoring, submitting,
    status: statusQuery.data?.jobId === activeJob?.jobId ? statusQuery.data?.status : undefined,
    result, error, start, forget,
  }
  return <Context.Provider value={value}>
    {children}
    {activeJob && !submitting && <TailoringProgress
      status={value.status}
      minimized={minimized}
      setMinimized={next => { setMinimized(next); persistMinimized(next) }}
    />}
  </Context.Provider>
}

export function useTailoringJob(): JobContext {
  const value = useContext(Context)
  if (!value) throw new Error('useTailoringJob requires TailoringJobProvider')
  return value
}

function TailoringProgress({ status, minimized, setMinimized }: {
  status: JobState
  minimized: boolean
  setMinimized: (value: boolean) => void
}) {
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null)
  const drag = useRef<{ x: number, y: number, left: number, top: number } | null>(null)
  const message = status === 'processing' ? 'AI is reviewing and tailoring your resume.' : 'Your request is queued. We will continue checking in the background.'
  if (!minimized) return <Dialog.Root open onOpenChange={open => { if (!open) setMinimized(true) }}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/55"/>
      <Dialog.Content className="rs-card fixed left-1/2 top-1/2 z-[81] w-[calc(100vw-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 p-6 shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'var(--rs-page)' }}><LoaderCircle className="animate-spin" size={23}/></div>
          <button type="button" className="rs-button rs-button-outline !min-h-10 !px-3" onClick={() => setMinimized(true)}><Minus size={16}/> Minimize</button>
        </div>
        <Dialog.Title className="mt-6 text-2xl font-semibold">Tailoring your resume</Dialog.Title>
        <Dialog.Description className="mt-3 text-sm leading-7" style={{ color: 'var(--rs-muted)' }}>{message}</Dialog.Description>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--rs-line)' }}><div className="h-full w-1/3 animate-pulse rounded-full" style={{ background: 'var(--rs-ink)' }}/></div>
        <p className="mt-4 text-xs" style={{ color: 'var(--rs-muted)' }}>You can minimize this window and keep working. This is an activity indicator, not a percentage estimate.</p>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || window.innerWidth < 768) return
    const node = event.currentTarget.parentElement
    if (!node) return
    const rect = node.getBoundingClientRect()
    drag.current = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const { x, y, left, top } = drag.current
    setPosition({
      x: Math.max(8, Math.min(window.innerWidth - 290, left + event.clientX - x)),
      y: Math.max(8, Math.min(window.innerHeight - 100, top + event.clientY - y)),
    })
  }
  return <aside role="status" aria-live="polite" className="fixed z-[75] bottom-[88px] right-4 w-[min(320px,calc(100vw-32px))] rounded-xl border p-3 shadow-2xl md:bottom-8 md:right-8" style={{
    background: 'var(--rs-surface)', borderColor: 'var(--rs-line)',
    ...(position && window.innerWidth >= 768 ? { position: 'fixed', left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : {}),
  }}>
    <div className="flex items-center justify-between gap-2">
      <div className="flex cursor-move items-center gap-2 touch-none select-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} aria-label="Drag progress widget on desktop">
        <GripVertical size={16} aria-hidden="true"/>
        <LoaderCircle size={17} className="animate-spin" aria-hidden="true"/>
        <span className="text-sm font-semibold">Tailoring in progress</span>
      </div>
      <button type="button" className="rs-button rs-button-outline !min-h-9 !p-2" aria-label="Expand tailoring progress" onClick={() => setMinimized(false)}><Maximize2 size={16}/></button>
    </div>
    <p className="mt-2 pl-6 text-xs" style={{ color: 'var(--rs-muted)' }}>{status === 'processing' ? 'Reviewing your experience…' : 'Queued or reconnecting…'}</p>
    <a href="/tailor-resume" className="mt-2 inline-flex items-center gap-1 pl-6 text-xs underline"><FileCheck2 size={13}/> View tailoring</a>
  </aside>
}
