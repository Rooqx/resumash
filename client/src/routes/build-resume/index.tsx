import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Download, ChevronRight, FileText, Sparkles, Eye, ArrowLeft, LayoutTemplate } from 'lucide-react'
import ResumashShell from '@/components/ResumashShell'
import SEO from '@/components/SEO'
import ResumeDocument from '@/features/resume-builder/templates/ResumeDocument'
import { resumeTemplates, type ResumeTemplateId } from '@/features/resume-builder/templates/registry'
import BasicInfoAndSummary from '@/components/buildResumeComponent/BasicInfoAndSummary'
import Experience from '@/components/buildResumeComponent/Experience'
import Education from '@/components/buildResumeComponent/Education'
import Skills from '@/components/buildResumeComponent/Skills'
import Project from '@/components/buildResumeComponent/Project'
import Certificate from '@/components/buildResumeComponent/Certificate'
import Award from '@/components/buildResumeComponent/Awards'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import { downloadResume } from '@/lib/serverActions/downloadPDF'
import { tailoredResumeSchema, type TailoredResume } from '@/features/resume-tailor/schemas'
import AiResumeQuestionnaire from '@/features/resume-builder/components/AiResumeQuestionnaire'
import A4Preview from '@/features/resume-builder/components/A4Preview'
import ActualPdfPreview from '@/features/resume-builder/components/ActualPdfPreview'
import TemplateGallery from '@/features/resume-builder/components/TemplateGallery'
import { restoreBuilderView, saveBuilderView, clearBuilderDraft } from '@/lib/persistence/resumeDrafts'

export const Route=createFileRoute('/build-resume/')({component:BuilderPage})
const steps=[
 {title:'Personal info',description:'Your details and summary',Component:BasicInfoAndSummary},
 {title:'Experience',description:'Work history and achievements',Component:Experience},
 {title:'Education',description:'Academic background',Component:Education},
 {title:'Skills',description:'Your capabilities',Component:Skills},
 {title:'Projects',description:'Selected work and projects',Component:Project},
 {title:'Additional',description:'Certificates and awards',Component:AdditionalSections},
] as const

function AdditionalSections(){
 const details=useInputStore(s=>s.inputValue.additionalInfo??'')
 const updateDetail=useInputStore(s=>s.setInputValue)
 return <div className="space-y-8"><Certificate/><Award/><label className="block text-sm">Additional details<textarea className="mt-2 min-h-28 w-full rounded-lg border bg-transparent p-3" value={details} onChange={event=>updateDetail('additionalInfo',event.target.value)} placeholder="Relevant volunteering, memberships or other verified details…"/></label></div>
}

function BuilderPage(){
 const client=useQueryClient()
 const [savedView] = useState(()=>restoreBuilderView())
 const [active,setActive]=useState(savedView?.active??0)
 const [template,setTemplate]=useState<ResumeTemplateId>(()=>resumeTemplates.some(t=>t.id===savedView?.template)?savedView!.template as ResumeTemplateId:'ats-essential')
 const [mobilePreview,setMobilePreview]=useState(false)
 const [showGallery,setShowGallery]=useState(!savedView)
 const editorHeading=useRef<HTMLHeadingElement>(null)
 const editorScroll=useRef<HTMLDivElement>(null)
 const [actualPdfOpen,setActualPdfOpen]=useState(false)
 const [downloading,setDownloading]=useState(false)
 const [showAiQuestionnaire,setShowAiQuestionnaire]=useState(() => !savedView && !client.getQueryData(['tailoredResume']) && !useInputStore.getState().inputValue.fullName && !useFieldStores.getState().fields.experience?.length)
 const [incomingResume] = useState(()=>client.getQueryData(['tailoredResume']))
 const [pendingImport,setPendingImport] = useState<TailoredResume|null>(null)
 const updateInput=useInputStore(s=>s.setInputData)
 const updateFields=useFieldStores(s=>s.setFields)
 const updateTags=useTagStore(s=>s.setTags)
 const fullName=useInputStore(s=>s.inputValue.fullName)
 const [saveWarning,setSaveWarning]=useState(false)
 useEffect(()=>{
  if(!saveBuilderView({active,template}))setSaveWarning(true)
 },[active,template])
 const clearWork=()=>{
  // Reset live stores first, then clear their persisted snapshots and UI state.
  useInputStore.getState().reset()
  useFieldStores.getState().setFields({experience:[],education:[],skills:[],projects:[],certificates:[],awards:[],references:[]})
  useTagStore.getState().setTags({})
  clearBuilderDraft()
  client.removeQueries({queryKey:['tailoredResume'],exact:true})
  setActive(0)
  setTemplate('ats-essential')
  setShowGallery(true)
 }
 useEffect(()=>{
  if(!incomingResume)return
  // Consume the one-time handoff before any editor changes can be persisted.
  client.removeQueries({queryKey:['tailoredResume'],exact:true})
  const parsed=tailoredResumeSchema.safeParse(incomingResume)
  if(!parsed.success)return
  setShowAiQuestionnaire(false)
  const currentInput=useInputStore.getState().inputValue
  const currentFields=useFieldStores.getState().fields
  const hasPreviousWork=Object.values(currentInput).some(value=>typeof value==='string'&&value.trim().length>0) ||
   Object.values(currentFields).some(entries=>Array.isArray(entries)&&entries.length>0)
  // Never replace an existing local draft without the candidate choosing.
  if(hasPreviousWork){setPendingImport(parsed.data);return}
  updateInput(parsed.data.inputValue)
  updateFields(parsed.data.fields)
  updateTags(parsed.data.tagFields??{})
 // One-time handoff only; do not replay it after local edits.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[])
 /**
  * Replace the editor's current state with a reviewed AI draft.
  * No separate AI draft store is maintained, so manual edits work normally.
  */
 const applyAiDraft=(draft:TailoredResume)=>{
  client.removeQueries({queryKey:['tailoredResume'],exact:true})
  updateInput(draft.inputValue)
  updateFields(draft.fields)
  updateTags(draft.tagFields??{})
  setActive(0)
  setMobilePreview(false)
  setShowGallery(false)
  setShowAiQuestionnaire(false)
 }
 useEffect(() => {
  if (!mobilePreview) return
  const previous = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  return () => { document.body.style.overflow = previous }
 }, [mobilePreview])
 const selectStep = (next: number) => {
  setActive(Math.max(0, Math.min(steps.length - 1, next)))
  window.requestAnimationFrame(() => {
   editorScroll.current?.scrollTo({top:0})
   editorHeading.current?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
   editorHeading.current?.focus({preventScroll:true})
  })
 }
 const StepComponent=steps[active]?.Component
 const filename=fullName?`${fullName.trim().replace(/\s+/g,'_')}_resume.pdf`:'resume.pdf'
 return <ResumashShell>
  <SEO title="Build your resume | Resumash" description="Create and edit a professional resume with live preview."/>
  <div className="rs-container pb-28 pt-10 md:py-16">
   <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>02 / Resume builder</p><h1 className="rs-editorial mt-3 text-5xl md:text-7xl">Make your experience count.</h1><p className="mt-3 text-sm" style={{color:'var(--rs-muted)'}}>Build your resume step by step. See every change as you make it.</p></div>
    <div className="flex flex-wrap gap-2"><button type="button" className="rs-button rs-button-outline" onClick={()=>setShowAiQuestionnaire(open=>!open)}><Sparkles size={16}/>{showAiQuestionnaire?'Build manually':'Build with AI'}</button><button className="rs-button rs-button-primary hidden lg:inline-flex" disabled={downloading||showAiQuestionnaire} onClick={()=>downloadResume(filename,setDownloading,template)}><Download size={16}/>{downloading?'Preparing PDF…':'Download PDF'}</button></div>
   </div>
   <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <span className="text-xs" style={{color:'var(--rs-muted)'}}>{saveWarning?'Browser autosave is unavailable':'Saved automatically on this device'}</span>
    <button type="button" className="rs-button rs-button-outline !min-h-9 text-xs" onClick={clearWork}>Start a new resume / clear saved work</button>
   </div>
   {pendingImport&&<div className="rs-card mb-5 flex flex-wrap items-center justify-between gap-3 p-4" role="alert">
     <p className="max-w-xl text-sm">You already have an autosaved resume. A reviewed tailored draft is ready. Replace the current editor only if you want to use that draft.</p>
     <div className="flex flex-wrap gap-2">
      <button type="button" className="rs-button rs-button-primary" onClick={()=>{updateInput(pendingImport.inputValue);updateFields(pendingImport.fields);updateTags(pendingImport.tagFields??{});setPendingImport(null);setActive(0);setShowAiQuestionnaire(false)}}>Use tailored draft</button>
      <button type="button" className="rs-button rs-button-outline" onClick={()=>setPendingImport(null)}>Keep my saved resume</button>
     </div>
    </div>}
   {showAiQuestionnaire&&<AiResumeQuestionnaire onDraft={applyAiDraft} onClose={()=>setShowAiQuestionnaire(false)}/>}
   {!showAiQuestionnaire && <>{showGallery ? <TemplateGallery selected={template} onSelect={selected => {setTemplate(selected);setShowGallery(false)}}/> :
    <div className="rs-card mb-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
     <div className="flex items-center gap-3"><LayoutTemplate size={20}/><div><p className="text-sm font-semibold">{resumeTemplates.find(item=>item.id===template)?.name}</p><p className="text-xs" style={{color:'var(--rs-muted)'}}>Selected resume template</p></div></div>
     <button type="button" className="rs-button rs-button-outline !min-h-9 !px-3" onClick={()=>setShowGallery(true)}>Change template</button>
    </div>}
   <div className="grid items-start gap-5 lg:grid-cols-[215px_minmax(300px,1fr)_minmax(340px,1.25fr)]">
    <aside className={`rs-card p-3 `}><p className="rs-eyebrow px-3 py-4" style={{color:'var(--rs-muted)'}}>Your sections</p><nav aria-label="Resume sections" className="space-y-1">{steps.map((step,index)=><button key={step.title} onClick={()=>selectStep(index)} aria-current={active===index?'step':undefined} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors" style={{background:active===index?'var(--rs-inverse)':'transparent',color:active===index?'var(--rs-inverse-text)':'var(--rs-ink)'}}><span className="text-xs opacity-60">{String(index+1).padStart(2,'0')}</span><span><span className="block text-sm font-semibold">{step.title}</span><span className="mt-1 block text-[11px] opacity-60">{step.description}</span></span></button>)}</nav></aside>
    <section className={`rs-card min-w-0 p-4 md:p-6 `}>
     <div className="flex items-center justify-between"><div><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Step {active+1} of {steps.length}</p><h2 ref={editorHeading} tabIndex={-1} className="mt-2 scroll-mt-28 text-xl font-semibold outline-none">{steps[active]?.title}</h2></div><FileText size={22} strokeWidth={1.4}/></div>
     <div ref={editorScroll} className="rs-legacy-builder mt-5 rounded-xl p-3 md:max-h-[min(75vh,780px)] md:overflow-y-auto md:overscroll-contain md:p-5">{StepComponent&&<StepComponent/>}</div>
     <div className="mt-6 flex justify-between gap-3"><button onClick={()=>selectStep(active-1)} disabled={active===0} className="rs-button rs-button-outline disabled:opacity-40">Previous</button><button onClick={()=>selectStep(active+1)} disabled={active===steps.length-1} className="rs-button rs-button-primary disabled:opacity-40">Next step <ChevronRight size={16}/></button></div>
    </section>
    <section className="rs-card hidden min-w-0 p-4 md:p-6 lg:block"><div className="mb-5 flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">Live resume preview</h2><button type="button" className="rs-button rs-button-outline !min-h-8 text-xs" onClick={()=>setActualPdfOpen(true)}>Inspect actual PDF pages</button></div><A4Preview><ResumeDocument template={template}/></A4Preview></section>
   </div>
   </>}
  </div>
  {!showAiQuestionnaire && <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t p-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden" style={{background:'var(--rs-surface)',borderColor:'var(--rs-line)'}}>
    <button type="button" className="rs-button rs-button-outline flex-1" onClick={()=>setMobilePreview(true)}><Eye size={16}/> Preview</button>
    <button type="button" className="rs-button rs-button-primary flex-1" disabled={downloading} onClick={()=>void downloadResume(filename,setDownloading,template)}><Download size={16}/>{downloading?'Preparing…':'Download'}</button>
   </div>}
   <Dialog.Root open={mobilePreview} onOpenChange={setMobilePreview}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-[65] bg-black/55"/>
    <Dialog.Content className="fixed inset-0 z-[70] overflow-y-auto p-3" style={{background:'var(--rs-page)'}}>
     <Dialog.Title className="sr-only">Resume preview</Dialog.Title>
     <Dialog.Description className="sr-only">Inspect the current resume and return to the editor.</Dialog.Description>
    <div className="sticky top-0 z-10 mb-3 flex flex-wrap items-center justify-between gap-3 border-b py-3" style={{background:'var(--rs-page)',borderColor:'var(--rs-line)'}}>
     <button type="button" className="rs-button rs-button-outline !min-h-10" onClick={()=>setMobilePreview(false)}><ArrowLeft size={16}/> Back to builder</button>
     <button type="button" className="rs-button rs-button-primary !min-h-10" disabled={downloading} onClick={()=>void downloadResume(filename,setDownloading,template)}><Download size={15}/> Download</button>
    </div>
    <A4Preview><ResumeDocument template={template}/></A4Preview>
    </Dialog.Content></Dialog.Portal></Dialog.Root>
   {actualPdfOpen&&<ActualPdfPreview template={template} onClose={()=>setActualPdfOpen(false)}/>}
 </ResumashShell>
}
