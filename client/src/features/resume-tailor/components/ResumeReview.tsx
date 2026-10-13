import { ArrowRight, FileText } from 'lucide-react'
import type { TailoringResponse } from '../schemas'
import ResumePdfPreview from '@/features/resume-builder/components/ResumePdfPreview'

export type ResumeView = 'original' | 'tailored' | 'comparison'

interface ResumeReviewProps {
  result: TailoringResponse | null
  originalUrl: string | null
  view: ResumeView
  onViewChange: (view: ResumeView) => void
  onContinue: () => void
  canContinue: boolean
}

/** Reuse the ATS Essential PDF renderer; no separate tailoring template. */
export default function ResumeReview({ result, originalUrl, view, onViewChange, onContinue, canContinue }: ResumeReviewProps) {
  return <section className="rs-card min-w-0 overflow-hidden p-4 md:p-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">Resume preview</h2>
      {result && <button type="button" disabled={!canContinue} onClick={onContinue}
        title={!canContinue ? 'Review and approve the draft first' : undefined}
        className="rs-button rs-button-primary !min-h-[38px] !px-3 disabled:opacity-40">Continue editing <ArrowRight size={15}/></button>}
    </div>
    <div className="mb-4 flex flex-wrap gap-2">
      {(['tailored','original','comparison'] as const).map(tab => <button key={tab} type="button"
        aria-pressed={view === tab} className={`rs-button !min-h-9 !px-3 !py-2 text-xs ${view===tab?'rs-button-primary':'rs-button-outline'}`}
        onClick={() => onViewChange(tab)}>{tab[0].toUpperCase() + tab.slice(1)}</button>)}
    </div>
    <div className={view === 'comparison' ? 'grid gap-4 xl:grid-cols-2' : 'grid grid-cols-1'}>
      {(view === 'original' || view === 'comparison') && <div className="min-w-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--rs-muted)'}}>Original uploaded PDF</p>
        {originalUrl ? <iframe title="Original uploaded PDF" src={originalUrl} className="h-[710px] w-full rounded-lg border bg-white" style={{borderColor:'var(--rs-line)'}}/> :
          <div className="flex min-h-[450px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 text-center text-black"><FileText size={32}/><p className="text-sm">Upload a PDF to preview your original resume.</p></div>}
      </div>}
      {(view === 'tailored' || view === 'comparison') && <div className="min-w-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--rs-muted)'}}>ATS Essential · actual PDF pages</p>
        {result ? <ResumePdfPreview template="ats-essential" snapshot={{ inputValue: result.inputValue, fields: result.fields, tagFields: result.tagFields ?? {} }} label="Tailored ATS Essential PDF preview"/> :
          <p className="p-6 text-center text-sm">Your reviewed resume will appear here.</p>}
      </div>}
    </div>
  </section>
}
