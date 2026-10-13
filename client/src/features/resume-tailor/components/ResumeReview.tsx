import { useState } from 'react'
import { ArrowRight, FileText } from 'lucide-react'
import type { TailoringResponse } from '../schemas'
import A4Preview from '@/features/resume-builder/components/A4Preview'
import ActualPdfPreview from '@/features/resume-builder/components/ActualPdfPreview'
import ResumeDocument from '@/features/resume-builder/templates/ResumeDocument'

export type ResumeView = 'original' | 'tailored' | 'comparison'

interface ResumeReviewProps {
  result: TailoringResponse | null
  originalUrl: string | null
  view: ResumeView
  onViewChange: (view: ResumeView) => void
  onContinue: () => void
  canContinue: boolean
}

/**
 * HTML previews update immediately as suggestions are accepted.
 * PDF generation is explicit and only runs when inspecting actual pages.
 * Both use the existing ATS Essential template and the same resume snapshot.
 */
export default function ResumeReview({ result, originalUrl, view, onViewChange, onContinue, canContinue }: ResumeReviewProps) {
  const [actualPdfOpen, setActualPdfOpen] = useState(false)
  const snapshot = result ? {
    inputValue: result.inputValue,
    fields: result.fields,
    tagFields: result.tagFields ?? {},
  } : null

  return <section className="rs-card min-w-0 overflow-hidden p-4 md:p-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">Resume preview</h2>
      <div className="flex flex-wrap items-center gap-2">
        {snapshot && <button type="button" onClick={() => setActualPdfOpen(true)}
          className="rs-button rs-button-outline !min-h-[38px] !px-3 text-xs">
          Inspect actual PDF pages
        </button>}
        {result && <button type="button" disabled={!canContinue} onClick={onContinue}
          title={!canContinue ? 'Review and approve the draft first' : undefined}
          className="rs-button rs-button-primary !min-h-[38px] !px-3 disabled:opacity-40">
          Continue editing <ArrowRight size={15}/>
        </button>}
      </div>
    </div>
    <div className="mb-4 flex flex-wrap gap-2">
      {(['tailored','original','comparison'] as const).map(tab => <button key={tab} type="button"
        aria-pressed={view === tab} className={`rs-button !min-h-9 !px-3 !py-2 text-xs ${view===tab?'rs-button-primary':'rs-button-outline'}`}
        onClick={() => onViewChange(tab)}>{tab[0].toUpperCase() + tab.slice(1)}</button>)}
    </div>
    <div className={view === 'comparison' ? 'grid gap-4 xl:grid-cols-2' : 'grid grid-cols-1'}>
      {(view === 'original' || view === 'comparison') && <div className="min-w-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--rs-muted)'}}>Original uploaded PDF</p>
        {originalUrl ? <iframe title="Original uploaded PDF" src={originalUrl}
          className="h-[710px] w-full rounded-lg border bg-white" style={{borderColor:'var(--rs-line)'}}/> :
          <div className="flex min-h-[450px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 text-center text-black">
            <FileText size={32}/><p className="text-sm">Upload a PDF to preview your original resume.</p>
          </div>}
      </div>}
      {(view === 'tailored' || view === 'comparison') && <div className="min-w-0">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--rs-muted)'}}>ATS Essential · live preview</p>
        <p className="mb-3 text-xs" style={{color:'var(--rs-muted)'}}>Updates instantly as you accept changes. Inspect actual PDF pages for exact pagination.</p>
        {snapshot ? <A4Preview label="Tailored ATS Essential live resume preview">
          <ResumeDocument template="ats-essential" snapshot={snapshot}/>
        </A4Preview> : <p className="p-6 text-center text-sm">Your reviewed resume will appear here.</p>}
      </div>}
    </div>
    {actualPdfOpen && snapshot && <ActualPdfPreview template="ats-essential" snapshot={snapshot} onClose={() => setActualPdfOpen(false)}/>}
  </section>
}
