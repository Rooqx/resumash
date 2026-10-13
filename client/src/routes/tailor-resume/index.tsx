import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, ArrowLeft, FileCheck, FileText, Sparkles, UploadCloud, Pencil, Eye, ClipboardCheck } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ResumashShell from '@/components/ResumashShell'
import SEO from '@/components/SEO'
import { useTailoringJob } from '@/features/resume-tailor/components/TailoringJobManager'
import { type TailoringResponse } from '@/features/resume-tailor/schemas'
import ResumeReview from '@/features/resume-tailor/components/ResumeReview'
import { applyApprovedChanges } from '@/features/resume-tailor/reviewChanges'
import { restoreTailorDraft, saveTailorDraft, clearTailorDraft, saveUploadedResume, restoreUploadedResume, clearUploadedResume } from '@/lib/persistence/resumeDrafts'

export const Route = createFileRoute('/tailor-resume/')({ component: TailorPage })

function TailorPage() {
  const [saved] = useState(() => restoreTailorDraft())
  const [jobDescription, setJobDescription] = useState(saved?.jobDescription ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<TailoringResponse | null>(saved?.result ?? null)
  const [mode, setMode] = useState<'setup' | 'review'>(saved?.result && !saved.sourceDirty ? 'review' : 'setup')
  const [sourceDirty, setSourceDirty] = useState(saved?.sourceDirty ?? false)
  const [approved, setApproved] = useState(saved?.approved ?? false)
  const [acceptedEdits, setAcceptedEdits] = useState<Set<number>>(() => new Set(saved?.acceptedEdits ?? []))
  const [view, setView] = useState<'tailored' | 'original' | 'comparison'>(saved?.view ?? 'tailored')
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [storageWarning, setStorageWarning] = useState(false)
  const [changingSource, setChangingSource] = useState(false)
  const fileRevision = useRef(0)
  const reviewHeading = useRef<HTMLHeadingElement>(null)
  const previewPanel = useRef<HTMLDivElement>(null)
  const changesPanel = useRef<HTMLElement>(null)
  const query = useQueryClient()
  const navigate = useNavigate()
  const job = useTailoringJob()
  const working = job.restoring || job.submitting || Boolean(job.activeJob)

  useEffect(() => {
    if (!file) { setOriginalUrl(null); return }
    const url = URL.createObjectURL(file)
    setOriginalUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    let cancelled = false
    const revision = fileRevision.current
    void restoreUploadedResume().then(savedFile => {
      if (!cancelled && revision === fileRevision.current && savedFile) setFile(current => current ?? savedFile)
    }).catch(() => setStorageWarning(true))
    return () => { cancelled = true }
  }, [])

  // The app-level manager receives results even when this route is unmounted.
  useEffect(() => {
    if (job.result) {
      setResult(job.result)
      setAcceptedEdits(new Set())
      setApproved(false)
      setSourceDirty(false)
      setMode('review')
      setChangingSource(false)
      window.requestAnimationFrame(() => reviewHeading.current?.focus())
    }
  }, [job.result])

  useEffect(() => {
    if (job.activeJob) setMode('setup')
  }, [job.activeJob])

  // Persist review decisions without re-triggering the generation job.
  useEffect(() => {
    const persist = () => {
      if (!jobDescription.trim() && !result) { clearTailorDraft(); return }
      if (!saveTailorDraft({ version: 1, jobDescription, result, approved, acceptedEdits: [...acceptedEdits], view, sourceDirty })) {
        setStorageWarning(true)
      }
    }
    const timer = window.setTimeout(persist, 350)
    window.addEventListener('pagehide', persist)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pagehide', persist)
    }
  }, [jobDescription, result, approved, acceptedEdits, view, sourceDirty])

  const submit = async () => {
    if (working || !file || !jobDescription.trim()) return
    setResult(null)
    setApproved(false)
    setAcceptedEdits(new Set())
    setChangingSource(false)
    setSourceDirty(false)
    // The global handler may finish while this route is unmounted.
    if (!saveTailorDraft({ version: 1, jobDescription, result: null, approved: false, acceptedEdits: [], view: 'tailored', sourceDirty: false })) {
      setStorageWarning(true)
    }
    try {
      await job.start(file, jobDescription)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit resume')
    }
  }

  const clearWork = async () => {
    if (job.activeJob && !window.confirm('Forget this local job reference? This does not cancel server-side tailoring.')) return
    fileRevision.current++
    try { await job.forget() } catch { setStorageWarning(true) }
    clearTailorDraft()
    void clearUploadedResume().catch(() => setStorageWarning(true))
    setJobDescription('')
    setFile(null)
    setResult(null)
    setApproved(false)
    setAcceptedEdits(new Set())
    setMode('setup')
    setChangingSource(false)
    setSourceDirty(false)
    query.removeQueries({ queryKey: ['tailoredResume'], exact: true })
    toast.success('Local tailoring data cleared')
  }

  const changeResume = (next: File | null) => {
    if (next && (next.type !== 'application/pdf' || next.size > 10 * 1024 * 1024)) {
      toast.error('Choose a PDF resume up to 10 MB')
      return
    }
    fileRevision.current++
    // A newly selected PDF cannot be compared as the original of the old AI result.
    if (result) { setSourceDirty(true); setApproved(false) }
    setFile(next)
    if (next) void saveUploadedResume(next).catch(() => setStorageWarning(true))
    else void clearUploadedResume().catch(() => setStorageWarning(true))
  }

  return <ResumashShell>
    <SEO title="Tailor your resume | Resumash" description="Tailor your resume for a role, then review evidence-backed changes."/>
    <div className="rs-container pb-28 pt-8 md:py-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs" style={{ color: 'var(--rs-muted)' }}>{storageWarning ? 'Local saving is unavailable' : 'Your work is automatically saved on this device'}</span>
        <button type="button" className="rs-button rs-button-outline !min-h-9 !px-3 text-xs" onClick={() => void clearWork()} disabled={job.restoring}>Clear local work</button>
      </div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="rs-eyebrow" style={{ color: 'var(--rs-muted)' }}>01 / Resume tailoring</p>
          <h1 className="rs-editorial mt-2 text-4xl md:text-6xl">The right story for the right role.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6" style={{ color: 'var(--rs-muted)' }}>Use your actual experience to prepare an application that matches the role.</p>
        </div>
        {mode === 'review' && result && !working && <button type="button" className="rs-button rs-button-outline" onClick={() => { setMode('setup'); setChangingSource(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Pencil size={16}/> Change resume or job</button>}
      </div>

      {mode === 'setup' || !result || working ? <>
        <div className="mx-auto max-w-3xl">
          <form className="rs-card space-y-6 p-5 md:p-8" onSubmit={event => { event.preventDefault(); void submit() }}>
            {changingSource && result && <div role="note" className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--rs-line)' }}>
              {sourceDirty ? 'Your sources have changed. Submit a new tailoring job before reviewing these inputs: the previous result refers to the older source.' : 'Your previous tailored result is saved. Submit again to generate a new result for changed inputs.'}
              {!sourceDirty && <button type="button" className="mt-2 flex items-center gap-1 text-sm underline" onClick={() => { setMode('review'); setChangingSource(false) }}><ArrowLeft size={14}/> Back to existing result</button>}
            </div>}
            <div><span className="rs-eyebrow" style={{ color: 'var(--rs-muted)' }}>Step 01</span><h2 className="mt-2 text-xl font-semibold">Job description</h2><p className="mt-2 text-sm" style={{ color: 'var(--rs-muted)' }}>Paste the job listing you want to apply for.</p></div>
            <textarea required aria-label="Job description" className="min-h-[180px] w-full resize-y rounded-xl border bg-transparent p-4 text-sm leading-6" style={{ borderColor: 'var(--rs-line)' }} value={jobDescription} disabled={working} onChange={event => { if (result && event.target.value !== jobDescription) { setSourceDirty(true); setApproved(false) } setJobDescription(event.target.value) }} placeholder="Paste the full job description…"/>
            <div><span className="rs-eyebrow" style={{ color: 'var(--rs-muted)' }}>Step 02</span><h2 className="mt-2 text-xl font-semibold">Your resume</h2></div>
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-5 text-center" style={{ borderColor: 'var(--rs-line)' }}>
              {file ? <FileCheck size={24}/> : <UploadCloud size={24}/>}
              <span className="max-w-full break-all text-sm font-semibold">{file ? file.name : 'Choose your PDF resume'}</span>
              <span className="text-xs" style={{ color: 'var(--rs-muted)' }}>PDF, maximum 10 MB</span>
              <input aria-label="Upload PDF resume" type="file" className="sr-only" accept=".pdf,application/pdf" disabled={working} onChange={event => changeResume(event.target.files?.[0] ?? null)}/>
            </label>
            <button className="rs-button rs-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!file || jobDescription.trim().length < 20 || working}><Sparkles size={17}/>{working ? 'Tailoring in progress…' : 'Tailor my resume'}<ArrowRight size={16}/></button>
            {working && <div role="status" aria-live="polite" className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--rs-line)' }}>{job.submitting ? 'Uploading and validating your resume…' : job.status === 'processing' ? 'AI is tailoring your resume. Minimize the popup to keep working.' : 'Your job is queued or reconnecting. You can explore the app while it runs.'}</div>}
            {job.error && <p role="alert" className="text-sm" style={{ color: 'var(--rs-muted)' }}>{job.error}</p>}
          </form>
        </div>
      </> : <>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4" style={{ borderColor: 'var(--rs-line)' }}>
          <div className="flex items-center gap-3"><FileCheck size={24}/><div><h2 tabIndex={-1} ref={reviewHeading} className="font-semibold">Your tailored resume is ready</h2><p className="text-xs" style={{ color: 'var(--rs-muted)' }}>Review suggested changes before accepting them.</p></div></div>
          <button type="button" className="rs-button rs-button-outline !min-h-10" onClick={() => { setMode('setup'); setChangingSource(true) }}><Pencil size={15}/> Update sources</button>
        </div>
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(290px,.75fr)]">
          <div ref={previewPanel} className="min-w-0 scroll-mt-24"><ResumeReview
            result={{ ...result, ...applyApprovedChanges(result, acceptedEdits) }}
            originalUrl={originalUrl}
            view={view}
            onViewChange={setView}
            canContinue={approved}
            onContinue={() => {
              if (!approved) return
              query.setQueryData(['tailoredResume'], applyApprovedChanges(result, acceptedEdits))
              void navigate({ to: '/build-resume' })
            }}
          /></div>
          <aside ref={changesPanel} className="rs-card min-w-0 scroll-mt-24 p-5 md:p-6">
            <div className="flex items-center gap-2"><Sparkles size={18}/><h2 className="text-lg font-semibold">Evidence-backed review</h2></div>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--rs-muted)' }}>All proposed edits begin unselected. Accept only changes supported by your real experience.</p>
            <div className="mt-5 max-h-[min(75vh,760px)] space-y-4 overflow-y-auto pr-1">
              {result.suggestions.length === 0 && <p className="text-sm">No individual edits were returned. Inspect the full generated draft.</p>}
              {result.suggestions.map((suggestion, index) => <div key={index} className="rounded-lg border p-4 text-sm" style={{ borderColor: 'var(--rs-line)' }}>
                <strong className="text-xs">{suggestion.priority.toUpperCase()} · {suggestion.section}</strong>
                <p className="mt-2"><strong>Original:</strong> {suggestion.original}</p>
                <p className="mt-2"><strong>Proposed:</strong> {suggestion.proposed}</p>
                <p className="mt-2 text-xs">Reason: {suggestion.reason}</p>
                <p className="mt-2 text-xs">Evidence: {suggestion.sourceQuote}</p>
                <label className="mt-3 flex items-start gap-2 font-semibold"><input type="checkbox" className="mt-1" checked={acceptedEdits.has(index)} onChange={event => {
                  setAcceptedEdits(current => { const next = new Set(current); if (event.target.checked) next.add(index); else next.delete(index); return next })
                  setApproved(false)
                }}/><span>Accept this rewrite</span></label>
                {suggestion.requiresConfirmation && <p className="mt-2 text-xs font-semibold">Requires your confirmation</p>}
              </div>)}
              {result.missingRequirements.length > 0 && <section><h3 className="font-semibold">Unverified requirements</h3>{result.missingRequirements.map((item, i) => <p className="mt-2 text-xs" key={i}>{item}</p>)}</section>}
              {result.clarificationQuestions.length > 0 && <section><h3 className="font-semibold">Questions to clarify</h3>{result.clarificationQuestions.map((item, i) => <p className="mt-2 text-xs" key={i}>{item.question}</p>)}</section>}
              {result.writingNotes.map((note, i) => <p className="text-xs" key={i}>{note}</p>)}
            </div>
            <label className="mt-6 flex items-start gap-3 border-t pt-4 text-sm leading-6" style={{ borderColor: 'var(--rs-line)' }}>
              <input type="checkbox" className="mt-1" checked={approved} onChange={event => setApproved(event.target.checked)}/>
              <span>I reviewed the original resume and selected changes. Only accepted rewrites will be transferred to the editor.</span>
            </label>
            <button type="button" disabled={!approved} className="rs-button rs-button-primary mt-5 w-full disabled:opacity-40" onClick={() => {
              query.setQueryData(['tailoredResume'], applyApprovedChanges(result, acceptedEdits))
              void navigate({ to: '/build-resume' })
            }}><FileText size={16}/> Continue editing <ArrowRight size={16}/></button>
          </aside>
        </div>
        <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t p-3 pb-[max(12px,env(safe-area-inset-bottom))] xl:hidden" style={{background:'var(--rs-surface)',borderColor:'var(--rs-line)'}}>
          <button type="button" className="rs-button rs-button-outline flex-1" onClick={()=>previewPanel.current?.scrollIntoView({behavior:'smooth',block:'start'})}><Eye size={16}/> Preview</button>
          <button type="button" className="rs-button rs-button-primary flex-1" onClick={()=>changesPanel.current?.scrollIntoView({behavior:'smooth',block:'start'})}><ClipboardCheck size={16}/> Review changes</button>
        </div>
      </>}
    </div>
  </ResumashShell>
}
