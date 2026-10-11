import { ArrowRight, FileText } from 'lucide-react'
import type { TailoredResume } from '../schemas'

export type ResumeView = 'original' | 'tailored' | 'comparison'

interface ResumeReviewProps {
  result: TailoredResume | null
  originalUrl: string | null
  view: ResumeView
  onViewChange: (view: ResumeView) => void
  onContinue: () => void
}

export default function ResumeReview({
  result,
  originalUrl,
  view,
  onViewChange,
  onContinue,
}: ResumeReviewProps) {
  return (
    <section className="rs-card min-w-0 overflow-hidden p-4 md:p-6">
     <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Resume preview</h2>{result&&<button className="rs-button rs-button-primary !min-h-[38px] !px-3" onClick={onContinue}>Continue editing <ArrowRight size={15}/></button>}</div>
     <div className="mb-4 flex flex-wrap gap-2"><button type="button" className={`rs-button !min-h-9 !px-3 !py-2 text-xs ${view==='tailored'?'rs-button-primary':'rs-button-outline'}`} onClick={()=>onViewChange('tailored')}>Tailored</button><button type="button" className={`rs-button !min-h-9 !px-3 !py-2 text-xs ${view==='original'?'rs-button-primary':'rs-button-outline'}`} onClick={()=>onViewChange('original')}>Original</button><button type="button" className={`rs-button !min-h-9 !px-3 !py-2 text-xs ${view==='comparison'?'rs-button-primary':'rs-button-outline'}`} onClick={()=>onViewChange('comparison')}>Comparison</button></div>
     <div className={view==='comparison'?'grid gap-4 xl:grid-cols-2':'grid grid-cols-1'}>
      {(view==='original'||view==='comparison')&&<div className="min-w-0">
       <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--rs-muted)'}}>Original resume</p>
       {originalUrl?<iframe title="Original uploaded PDF" src={originalUrl} className="h-[650px] w-full rounded-lg border bg-white" style={{borderColor:'var(--rs-line)'}}/>:<div className="flex min-h-[450px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 text-center text-black"><FileText size={32}/><p className="text-sm">Upload a PDF to preview your original resume.</p></div>}
      </div>}
      {(view==='tailored'||view==='comparison')&&<div className="min-w-0">
       {view==='comparison'&&<p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--rs-muted)'}}>Tailored resume</p>}
       <div className="mx-auto min-h-[630px] w-full bg-white px-5 py-10 text-black shadow-lg md:px-9">
        {result?<><h3 className="font-serif text-3xl">{result.inputValue?.fullName||'Your Name'}</h3><p className="mt-1 text-sm text-neutral-600">{result.inputValue?.label}</p><p className="mt-3 text-xs text-neutral-500">{[result.inputValue?.email,result.inputValue?.phone,result.inputValue?.city].filter(Boolean).join(' · ')}</p>{result.inputValue?.summary&&<div className="mt-8"><h4 className="border-b pb-2 text-xs font-bold tracking-wider">SUMMARY</h4><p className="mt-3 text-xs leading-6">{result.inputValue.summary}</p></div>}{Object.entries(result.fields??{}).filter(([,entries])=>Array.isArray(entries)&&entries.length>0).map(([section,entries])=><div key={section} className="mt-8"><h4 className="border-b pb-2 text-xs font-bold tracking-wider">{section.toUpperCase()}</h4>{entries.map((entry,index)=><div key={index} className="mt-4 space-y-1 text-xs leading-6">{Object.entries(entry).filter(([,value])=>typeof value==='string'&&Boolean(value)).map(([key,value])=><p key={key}>{String(value)}</p>)}</div>)}</div>)}</>:<div className="flex h-96 flex-col items-center justify-center gap-4 text-center"><FileText size={35} className="text-neutral-400"/><p className="font-serif text-2xl">Your next chapter starts here.</p><p className="max-w-xs text-sm leading-6 text-neutral-500">Your tailored resume will appear here when the AI has finished processing your document.</p></div>}
       </div>
      </div>}
     </div>
    </section>
  )
}
