import { useEffect, useState, type FormEvent } from 'react'
import { createElement, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import { createFileRoute } from '@tanstack/react-router'
import { Download, FileText, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { saveAs } from 'file-saver'
import { z } from 'zod'
import ResumashShell from '@/components/ResumashShell'
import { generateCoverLetter } from '@/features/cover-letter/services/generateCoverLetter'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import { restoreTailorDraft, restoreBuilderView } from '@/lib/persistence/resumeDrafts'
import { applyApprovedChanges } from '@/features/resume-tailor/reviewChanges'

export const Route = createFileRoute('/cover-letter/')({ component: CoverLetterPage })
const DRAFT_KEY = 'resumash:cover-letter:draft:v1'
const draftSchema = z.object({
  name: z.string(), role: z.string(), company: z.string(),
  description: z.string(), experience: z.string(),
  tone: z.enum(['Professional', 'Conversational', 'Enthusiastic', 'Concise']),
  letter: z.string(),
  layout: z.enum(['ats', 'modern']).default('ats'),
})
type Draft = z.infer<typeof draftSchema>
const empty: Draft = {
  name: '', role: '', company: '', description: '',
  experience: '', tone: 'Professional', letter: '', layout: 'ats',
}
function restore(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    const template = restoreBuilderView()?.template
    return raw ? draftSchema.parse(JSON.parse(raw)) : {...empty, layout:template && !['ats-essential','classic'].includes(template) ? 'modern' : 'ats'}
  } catch { return empty }
}

/** Resume data is read only when the candidate chooses to use it. */
function factsFromResume(snapshot?: {inputValue: Record<string,string>, fields: Record<string,Array<Record<string,unknown>>>, tagFields?: Record<string,{tags:string[]}>}) {
  const info = snapshot?.inputValue ?? useInputStore.getState().inputValue
  const rows = snapshot?.fields ?? useFieldStores.getState().fields
  const tags = snapshot?.tagFields ?? useTagStore.getState().fields
  const jobs = (rows.experience ?? []).map((job, index) => {
    const description = [job.jobSummary, ...(tags['jobHighlights-' + index]?.tags ?? [])].filter(Boolean).join('; ')
    return [job.jobPosition, job.companyName, description].filter(Boolean).join(' — ')
  })
  const projects = (rows.projects ?? []).map(job => [job.name, job.description].filter(Boolean).join(': '))
  const skills = (rows.skills ?? []).flatMap((skill, index) => [skill.skillName, ...(tags['skills-' + index]?.tags ?? [])]).filter(Boolean)
  return {
    name: String(info.fullName ?? ''),
    role: String(info.label ?? ''),
    experience: [info.summary, ...jobs, ...projects, skills.length ? 'Skills: ' + skills.join(', ') : ''].filter(Boolean).join('\n\n'),
  }
}

function CoverLetterPage() {
  const [initial] = useState(restore)
  const [data, setData] = useState<Draft>(initial)
  const [isGenerating, setGenerating] = useState(false)
  const [isExporting, setExporting] = useState(false)
  const [error, setError] = useState('')
  const [mobilePreview, setMobilePreview] = useState(false)
  const [saveWarning, setSaveWarning] = useState(false)
  const update = <K extends keyof Draft>(field: K, value: Draft[K]) =>
    setData(current => ({ ...current, [field]: value }))

  useEffect(() => {
    const save = () => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)) }
      catch { setSaveWarning(true) }
    }
    const timeout = window.setTimeout(save, 350)
    window.addEventListener('pagehide', save)
    return () => { window.clearTimeout(timeout); window.removeEventListener('pagehide', save) }
  }, [data])
  useEffect(() => {
    if (!mobilePreview) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old }
  }, [mobilePreview])

  const approvedTailor = restoreTailorDraft()
  const hasTailored = Boolean(approvedTailor?.approved && approvedTailor.result)
  const useResume = (tailored = false) => {
    const original = tailored ? restoreTailorDraft() : null
    if (tailored && (!original?.approved || !original.result)) {toast.error('Review and approve the tailored resume first.');return}
    const facts = factsFromResume(original?.result ? applyApprovedChanges(original.result, new Set(original.acceptedEdits)) : undefined)
    if (!facts.name && !facts.experience) {
      toast.error('Build a resume first, or enter your details manually.')
      return
    }
    if (data.experience.trim() && !window.confirm('Replace the experience text with details from your saved resume?')) return
    setData(current => ({
      ...current,
      name: current.name || facts.name,
      role: current.role || facts.role,
      experience: facts.experience,
    }))
    toast.success('Relevant resume information added. Review it before generating.')
  }

  const generate = async (event: FormEvent) => {
    event.preventDefault()
    if (data.letter.trim() && !window.confirm('Replace the current letter draft? Your previous wording will be overwritten.')) return
    setGenerating(true)
    setError('')
    try {
      const letter = await generateCoverLetter({
        applicantName: data.name,
        targetRole: data.role,
        company: data.company,
        jobDescription: data.description,
        experience: data.experience,
        tone: data.tone,
      })
      update('letter', letter)
      toast.success('Cover letter draft created. Review every factual statement.')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to generate cover letter'
      setError(message)
      toast.error(message)
    } finally { setGenerating(false) }
  }

  const download = async () => {
    if (!data.letter.trim() || isExporting) return
    setExporting(true)
    try {
      const [{ pdf }, { default: CoverLetterPdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/features/cover-letter/export/CoverLetterPdfDocument'),
      ])
      const doc = createElement(CoverLetterPdfDocument, data) as ReactElement<DocumentProps>
      const blob = await pdf(doc).toBlob()
      const header = new TextDecoder().decode(await blob.slice(0, 5).arrayBuffer())
      if (blob.size < 300 || header !== '%PDF-') throw new Error('The generated PDF is invalid.')
      const filename = (data.name.trim().replace(/[^a-zA-Z0-9_-]+/g, '_') || 'Cover_Letter') + '_Cover_Letter.pdf'
      saveAs(blob, filename)
      toast.success('Cover letter PDF prepared')
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Could not export PDF')
    } finally { setExporting(false) }
  }

  const preview = <div className={`rs-letter-page mx-auto min-h-[650px] max-w-[680px] bg-white px-6 py-9 text-neutral-900 shadow-md sm:px-12 sm:py-14 ${data.layout==='modern'?'border-l-4 border-neutral-700':''}`}>
    <div className="border-b border-neutral-300 pb-5">
      <h2 className="text-2xl font-bold">{data.name || 'Your Name'}</h2>
      <p className="mt-2 text-sm text-neutral-600">{[data.role, data.company].filter(Boolean).join(' · ')}</p>
    </div>
    <p className="rs-letter-body mt-8 whitespace-pre-wrap text-sm leading-7">{data.letter || 'Your cover letter preview will appear here once you generate or write your draft.'}</p>
  </div>

  return <ResumashShell><div className="rs-container pb-28 pt-9 md:py-16">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>03 / Cover letter</p>
        <h1 className="rs-editorial mt-2 text-4xl md:text-6xl">Your introduction, refined.</h1>
        <p className="mt-3 text-sm" style={{color:'var(--rs-muted)'}}>Use your real experience to create a focused, editable application letter.</p>
      </div>
      <span className="inline-flex items-center gap-2 text-xs" style={{color:'var(--rs-muted)'}}><CheckCircle2 size={14}/>{saveWarning?'Saving unavailable':'Saved on this device'}</span>
    </div>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
      <section className="rs-card min-w-0 p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Application details</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={()=>useResume(false)} className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"><FileText size={15}/> Use my resume</button>
            {hasTailored && <button type="button" onClick={()=>useResume(true)} className="rs-button rs-button-outline !min-h-10 !px-3 text-xs">Use approved tailored resume</button>}
          </div>
        </div>
        <form onSubmit={event => void generate(event)} className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">Your name *<input required minLength={2} className="rs-form-input" value={data.name} onChange={e=>update('name',e.target.value)} placeholder="Your full name"/></label>
            <label className="block text-sm">Target role *<input required minLength={2} className="rs-form-input" value={data.role} onChange={e=>update('role',e.target.value)} placeholder="e.g. Product Designer"/></label>
          </div>
          <label className="block text-sm">Company *<input required className="rs-form-input" value={data.company} onChange={e=>update('company',e.target.value)} placeholder="Employer name"/></label>
          <label className="block text-sm">Job description *<textarea required minLength={20} rows={5} className="rs-form-input resize-y" value={data.description} onChange={e=>update('description',e.target.value)} placeholder="Paste the job listing…"/></label>
          <label className="block text-sm">Your real experience *<textarea required minLength={20} rows={5} className="rs-form-input resize-y" value={data.experience} onChange={e=>update('experience',e.target.value)} placeholder="Your experience and real achievements. Or use your saved resume."/></label>
          <fieldset><legend className="mb-2 text-sm font-semibold">Letter style</legend><div className="flex flex-wrap gap-2">{(['ats','modern'] as const).map(style=><button type="button" key={style} aria-pressed={data.layout===style} onClick={()=>update('layout',style)} className={`rs-button !min-h-10 !px-4 text-xs ${data.layout===style?'rs-button-primary':'rs-button-outline'}`}>{style==='ats'?'ATS / Classic':'Modern'}</button>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-sm font-semibold">Writing tone</legend><div className="grid grid-cols-2 gap-2">
            {(['Professional','Conversational','Enthusiastic','Concise'] as const).map(tone => <button type="button" key={tone} aria-pressed={data.tone===tone} onClick={()=>update('tone',tone)} className={`rs-button !min-h-10 !px-2 text-xs ${data.tone===tone?'rs-button-primary':'rs-button-outline'}`}>{tone}</button>)}
          </div></fieldset>
          <button type="submit" disabled={isGenerating || data.description.trim().length < 20 || data.experience.trim().length < 20} className="rs-button rs-button-primary w-full disabled:opacity-50"><Sparkles size={16}/>{isGenerating?'Generating your letter…':data.letter?'Regenerate cover letter':'Generate cover letter'}</button>
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
          <p className="text-xs leading-6" style={{color:'var(--rs-muted)'}}>Review every claim. AI improves wording, but does not verify personal facts.</p>
        </form>
        <div className="mt-6 border-t pt-5" style={{borderColor:'var(--rs-line)'}}>
          <label className="block text-sm font-semibold">Edit your cover letter<textarea className="rs-form-input min-h-72 resize-y font-normal" value={data.letter} onChange={e=>update('letter',e.target.value)} placeholder="Generate a draft above, or write your own cover letter here."/></label>
        </div>
      </section>
      <section className="rs-card hidden min-w-0 p-4 lg:block lg:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-semibold"><FileText size={18}/> Cover letter preview</h2>
          <button type="button" onClick={()=>void download()} disabled={!data.letter.trim()||isExporting} className="rs-button rs-button-primary !min-h-10 disabled:opacity-40"><Download size={16}/>{isExporting?'Preparing…':'Download PDF'}</button>
        </div>
        {preview}
      </section>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t p-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden" style={{background:'var(--rs-surface)',borderColor:'var(--rs-line)'}}>
      <button type="button" className="rs-button rs-button-outline flex-1" onClick={()=>setMobilePreview(true)}><FileText size={15}/> Preview</button>
      <button type="button" className="rs-button rs-button-primary flex-1" disabled={!data.letter.trim()||isExporting} onClick={()=>void download()}><Download size={15}/> Download</button>
    </div>
    {mobilePreview && <div role="dialog" aria-modal="true" aria-label="Cover letter preview" className="fixed inset-0 z-[70] overflow-y-auto p-3" style={{background:'var(--rs-page)'}}>
      <div className="sticky top-0 z-10 mb-3 flex items-center justify-between border-b py-3" style={{background:'var(--rs-page)',borderColor:'var(--rs-line)'}}>
        <button type="button" onClick={()=>setMobilePreview(false)} className="rs-button rs-button-outline !min-h-10"><ArrowLeft size={16}/> Back to editor</button>
        <button type="button" onClick={()=>void download()} disabled={!data.letter.trim()||isExporting} className="rs-button rs-button-primary !min-h-10"><Download size={16}/> PDF</button>
      </div>
      {preview}
    </div>}
  </div></ResumashShell>
}
