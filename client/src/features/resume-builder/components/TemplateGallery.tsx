import { useState, memo } from 'react'
import { Check, Eye, X } from 'lucide-react'
import { resumeTemplates, type ResumeTemplateId } from '../templates/registry'
import { sampleForTemplate } from '../templates/sampleResume'
import ResumeDocument from '../templates/ResumeDocument'
import A4Preview from './A4Preview'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'

const SampleThumbnail = memo(function SampleThumbnail({ template }: {template:ResumeTemplateId}) {
 return <div aria-hidden="true" className="rs-template-thumbnail">
   <div className="rs-template-thumbnail-paper">
    <ResumeDocument template={template} snapshot={sampleForTemplate(template)}/>
   </div>
 </div>
})

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
  const [portraitError,setPortraitError]=useState('')
  const setInputValue=useInputStore(s=>s.setInputValue)
  const savedPortrait=useInputStore(s=>s.inputValue.profilePhotoDataUrl)
  const role = useInputStore(s=>s.inputValue.label??'')
  const experienceCount = useFieldStores(s=>s.fields.experience?.length??0)
  const earlyCareerEvidence = useFieldStores(s=>(s.fields.education?.length??0)+(s.fields.projects?.length??0))
  const knownExperience = useFieldStores(s=>s.fields.experience?.filter(item=>Boolean(item.jobPosition||item.companyName)).length??0)
  // Do not infer leadership merely because a target vacancy contains 'manager'.
  const seniorRole = /(?:director|executive|head of|chief|vice president)/i.test(role)
  const recommended: ResumeTemplateId = seniorRole && knownExperience>=2
    ? 'executive' : experienceCount===0&&earlyCareerEvidence>0 ? 'classic' : 'ats-essential'
  const uploadPortrait=async(file:File|undefined)=>{
    if(!file)return
    if(!['image/png','image/jpeg'].includes(file.type)||file.size>4*1024*1024){
      setPortraitError('Choose a PNG or JPEG smaller than 4 MB.')
      return
    }
    try{
      const image=await createImageBitmap(file)
      const canvas=document.createElement('canvas')
      canvas.width=512
      canvas.height=512
      const ctx=canvas.getContext('2d')
      if(!ctx){image.close();throw new Error('Image cropping is unsupported')}
      const side=Math.min(image.width,image.height)
      ctx.drawImage(image,(image.width-side)/2,(image.height-side)/2,side,side,0,0,512,512)
      image.close()
      const data=canvas.toDataURL('image/jpeg',0.8)
      if(data.length>650000)throw new Error('Portrait is too large after cropping')
      setInputValue('profilePhotoDataUrl',data)
      setPortraitError('')
    }catch(error){setPortraitError(error instanceof Error?error.message:'Unable to process portrait')}
  }
  return <>
    <section className="mb-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Choose your presentation</p>
          <h2 className="mt-2 text-xl font-semibold">Five reference-inspired layouts. Your story, unchanged.</h2>
          <p className="mt-1 text-sm" style={{color:'var(--rs-muted)'}}>Templates change presentation and section priority—not your facts. Sample content is fictional.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {resumeTemplates.map(item=><article key={item.id} className="rs-card overflow-hidden p-3">
          <SampleThumbnail template={item.id}/>
          <div className="mt-3 flex items-start justify-between gap-2">
            <div><h3 className="text-sm font-semibold">{item.name}</h3>
              <p className="mt-1 text-xs leading-5" style={{color:'var(--rs-muted)'}}>{item.description}</p></div>
            {item.id===recommended&&<span className="rounded border px-2 py-1 text-[10px]">Recommended</span>}
          </div>
          <p className="mt-2 text-xs font-semibold">{item.category} · {item.ats}</p><p className="mt-1 text-xs" style={{color:'var(--rs-muted)'}}>Best for: {item.bestFor}</p>
          <div className="mt-4 flex gap-2">
            <button type="button" className={`rs-button flex-1 !min-h-9 !px-2 text-xs ${selected===item.id?'rs-button-primary':'rs-button-outline'}`}
              onClick={()=>onSelect(item.id)}>{selected===item.id?<><Check size={13}/> Selected</>:'Use template'}</button>
            <button type="button" aria-label={`Preview ${item.name}`} className="rs-button rs-button-outline !min-h-9 !px-3" onClick={()=>setOpen(item.id)}><Eye size={14}/></button>
          </div>
        </article>)}
      </div>
      {selected==='executive'&&<div className="mt-4 rounded-lg border p-4">
        <p className="text-sm font-semibold">Executive Prestige portrait (optional)</p>
        <p className="mt-1 text-xs" style={{color:'var(--rs-muted)'}}>Upload a PNG or JPEG for the photo panel. Your browser crops the image locally; the default uses your initials.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="text-xs" htmlFor="rs-portrait-upload">Upload portrait</label>
          <input id="rs-portrait-upload" type="file" accept="image/png,image/jpeg" aria-label="Choose executive resume portrait" className="max-w-full text-xs" onChange={event=>{void uploadPortrait(event.target.files?.[0])}}/>
          {!!savedPortrait&&<button className="rs-button rs-button-outline !min-h-8 text-xs" type="button" onClick={()=>setInputValue('profilePhotoDataUrl','')}>Remove portrait</button>}
        </div>
        {portraitError&&<p role="alert" className="mt-2 text-xs text-red-500">{portraitError}</p>}
      </div>}
    </section>
    {open&&<div role="dialog" aria-modal="true" aria-label="Fully populated template sample"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-3 md:p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-[var(--rs-surface)] p-4 shadow-xl md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3"><div>
          <h2 className="text-lg font-semibold">{resumeTemplates.find(t=>t.id===open)?.name}</h2>
          <p className="text-xs" style={{color:'var(--rs-muted)'}}>Fictional sample resume · A4</p></div>
          <button type="button" className="rs-button rs-button-outline !p-2" aria-label="Close preview" onClick={()=>setOpen(null)}><X size={18}/></button>
        </div>
        <A4Preview label="Sample resume preview"><ResumeDocument snapshot={sampleForTemplate(open)} template={open}/></A4Preview>
        <button type="button" className="rs-button rs-button-primary mt-4" onClick={()=>{onSelect(open);setOpen(null)}}>Choose this template</button>
      </div>
    </div>}
  </>
}
