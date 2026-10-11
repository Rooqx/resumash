import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Download, ChevronRight, FileText } from 'lucide-react'
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
import { tailoredResumeSchema } from '@/features/resume-tailor/schemas'

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
 return <div className="space-y-8"><Certificate/><Award/></div>
}

function BuilderPage(){
 const [active,setActive]=useState(0)
 const [template,setTemplate]=useState<ResumeTemplateId>('modern')
 const [mobilePreview,setMobilePreview]=useState(false)
 const [downloading,setDownloading]=useState(false)
 const client=useQueryClient()
 const resume=client.getQueryData(['tailoredResume'])
 const updateInput=useInputStore(s=>s.setInputData)
 const updateFields=useFieldStores(s=>s.setFields)
 const updateTags=useTagStore(s=>s.setTags)
 const fullName=useInputStore(s=>s.inputValue.fullName)
 useEffect(()=>{
  const parsed=tailoredResumeSchema.safeParse(resume)
  if(parsed.success){updateInput(parsed.data.inputValue);updateFields(parsed.data.fields);updateTags(parsed.data.tagFields??{})}
 },[resume,updateInput,updateFields,updateTags])
 const StepComponent=steps[active]?.Component
 const filename=fullName?`${fullName.trim().replace(/\s+/g,'_')}_resume.pdf`:'resume.pdf'
 return <ResumashShell>
  <SEO title="Build your resume | Resumash" description="Create and edit a professional resume with live preview."/>
  <div className="rs-container py-10 md:py-16">
   <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>02 / Resume builder</p><h1 className="rs-editorial mt-3 text-5xl md:text-7xl">Make your experience count.</h1><p className="mt-3 text-sm" style={{color:'var(--rs-muted)'}}>Build your resume step by step. See every change as you make it.</p></div>
    <button className="rs-button rs-button-primary" disabled={downloading} onClick={()=>downloadResume(filename,setDownloading,template)}><Download size={16}/>{downloading?'Preparing PDF…':'Download PDF'}</button>
   </div>
   <div className="mb-5 flex gap-2 lg:hidden">
    <button onClick={()=>setMobilePreview(false)} className={`rs-button flex-1 ${!mobilePreview?'rs-button-primary':'rs-button-outline'}`}>Edit resume</button>
    <button onClick={()=>setMobilePreview(true)} className={`rs-button flex-1 ${mobilePreview?'rs-button-primary':'rs-button-outline'}`}>Preview</button>
   </div>
   <div className="grid items-start gap-5 lg:grid-cols-[215px_minmax(300px,1fr)_minmax(340px,1.25fr)]">
    <aside className={`rs-card p-3 ${mobilePreview?'hidden lg:block':''}`}><p className="rs-eyebrow px-3 py-4" style={{color:'var(--rs-muted)'}}>Your sections</p><nav aria-label="Resume sections" className="space-y-1">{steps.map((step,index)=><button key={step.title} onClick={()=>setActive(index)} aria-current={active===index?'step':undefined} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors" style={{background:active===index?'var(--rs-inverse)':'transparent',color:active===index?'var(--rs-inverse-text)':'var(--rs-ink)'}}><span className="text-xs opacity-60">{String(index+1).padStart(2,'0')}</span><span><span className="block text-sm font-semibold">{step.title}</span><span className="mt-1 block text-[11px] opacity-60">{step.description}</span></span></button>)}</nav></aside>
    <section className={`rs-card min-w-0 p-4 md:p-6 ${mobilePreview?'hidden lg:block':''}`}>
     <div className="flex items-center justify-between"><div><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Step {active+1} of {steps.length}</p><h2 className="mt-2 text-xl font-semibold">{steps[active]?.title}</h2></div><FileText size={22} strokeWidth={1.4}/></div>
     <div className="rs-legacy-builder mt-5 rounded-xl bg-[#171717] p-3 text-white md:p-5">{StepComponent&&<StepComponent/>}</div>
     <div className="mt-6 flex justify-between gap-3"><button onClick={()=>setActive(i=>Math.max(0,i-1))} disabled={active===0} className="rs-button rs-button-outline disabled:opacity-40">Previous</button><button onClick={()=>setActive(i=>Math.min(steps.length-1,i+1))} disabled={active===steps.length-1} className="rs-button rs-button-primary disabled:opacity-40">Next step <ChevronRight size={16}/></button></div>
    </section>
    <section className={`rs-card min-w-0 p-4 md:p-6 ${!mobilePreview?'hidden lg:block':''}`}><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">Live resume preview</h2><span className="text-xs" style={{color:'var(--rs-muted)'}}>A4</span></div><fieldset className="mb-5"><legend className="mb-2 text-xs font-semibold">Choose a resume template</legend><div className="grid gap-2 sm:grid-cols-3">{resumeTemplates.map(item=><button type="button" key={item.id} onClick={()=>setTemplate(item.id)} aria-pressed={template===item.id} className={`rounded-lg border px-3 py-3 text-left text-xs ${template===item.id?'rs-button-primary':'rs-button-outline'}`}><strong className="block">{item.name}</strong><span className="mt-1 block opacity-70">{item.description}</span></button>)}</div></fieldset><div className="max-h-[830px] overflow-auto rounded-lg bg-[#dddddd] p-2 md:p-5"><div className="rs-resume-zoom mx-auto w-max origin-top-left"><ResumeDocument template={template}/></div></div></section>
   </div>
  </div>
 </ResumashShell>
}
