import { useState } from 'react'
import { Check, Eye, X } from 'lucide-react'
import { resumeTemplates, type ResumeTemplateId } from '../templates/registry'
import { sampleResume } from '../templates/sampleResume'
import ResumeDocument from '../templates/ResumeDocument'
import A4Preview from './A4Preview'

interface Props {
  selected: ResumeTemplateId
  onSelect: (template: ResumeTemplateId) => void
}

/**
 * Template cards show a fully populated *fictional* candidate so users can
 * judge page density and hierarchy before committing their own information.
 * Previewing a sample never writes sample data into the user's stores.
 */
export default function TemplateGallery({ selected, onSelect }: Props) {
  const [open, setOpen] = useState<ResumeTemplateId|null>(null)
  return <>
    <section className="mb-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Choose your presentation</p>
          <h2 className="mt-2 text-xl font-semibold">Three layouts. One truthful story.</h2>
          <p className="mt-1 text-sm" style={{color:'var(--rs-muted)'}}>Templates change presentation and section priority—not your facts. Sample content is fictional.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {resumeTemplates.map(item=><article key={item.id} className="rs-card overflow-hidden p-3">
          <div className="relative h-48 overflow-hidden rounded-md border bg-[#e9eaeb]" style={{borderColor:'var(--rs-line)'}}>
            <div className="absolute left-1/2 top-3 origin-top-left" style={{width:794,height:1122,transform:'translateX(-50%) scale(.24)',transformOrigin:'0 0',left:'50%',marginLeft:-95}}>
              <ResumeDocument template={item.id} snapshot={sampleResume}/>
            </div>
          </div>
          <div className="mt-3 flex items-start justify-between gap-2">
            <div><h3 className="text-sm font-semibold">{item.name}</h3>
              <p className="mt-1 text-xs leading-5" style={{color:'var(--rs-muted)'}}>{item.description}</p></div>
            {item.id==='modern'&&<span className="rounded border px-2 py-1 text-[10px]">Recommended</span>}
          </div>
          <p className="mt-2 text-xs" style={{color:'var(--rs-muted)'}}>Best for: {item.bestFor}</p>
          <div className="mt-4 flex gap-2">
            <button type="button" className={`rs-button flex-1 !min-h-9 !px-2 text-xs ${selected===item.id?'rs-button-primary':'rs-button-outline'}`}
              onClick={()=>onSelect(item.id)}>{selected===item.id?<><Check size={13}/> Selected</>:'Use template'}</button>
            <button type="button" aria-label={`Preview ${item.name}`} className="rs-button rs-button-outline !min-h-9 !px-3" onClick={()=>setOpen(item.id)}><Eye size={14}/></button>
          </div>
        </article>)}
      </div>
    </section>
    {open&&<div role="dialog" aria-modal="true" aria-label="Fully populated template sample"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-3 md:p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-[var(--rs-surface)] p-4 shadow-xl md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3"><div>
          <h2 className="text-lg font-semibold">{resumeTemplates.find(t=>t.id===open)?.name}</h2>
          <p className="text-xs" style={{color:'var(--rs-muted)'}}>Fictional sample resume · A4</p></div>
          <button type="button" className="rs-button rs-button-outline !p-2" aria-label="Close preview" onClick={()=>setOpen(null)}><X size={18}/></button>
        </div>
        <A4Preview label="Sample resume preview"><ResumeDocument snapshot={sampleResume} template={open}/></A4Preview>
        <button type="button" className="rs-button rs-button-primary mt-4" onClick={()=>{onSelect(open);setOpen(null)}}>Choose this template</button>
      </div>
    </div>}
  </>
}
