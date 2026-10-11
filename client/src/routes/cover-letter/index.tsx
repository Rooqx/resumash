import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FileText, Sparkles } from 'lucide-react'
import ResumashShell from '@/components/ResumashShell'
import { generateCoverLetter } from '@/features/cover-letter/services/generateCoverLetter'

export const Route = createFileRoute('/cover-letter/')({component:CoverLetterPage})
type Tone='Professional'|'Conversational'|'Enthusiastic'|'Concise'
function CoverLetterPage(){
 const [name,setName]=useState('')
 const [role,setRole]=useState('')
 const [company,setCompany]=useState('')
 const [description,setDescription]=useState('')
 const [experience,setExperience]=useState('')
 const [tone,setTone]=useState<Tone>('Professional')
 const [letter,setLetter]=useState('')
 const [isGenerating,setIsGenerating]=useState(false)
 const [generationError,setGenerationError]=useState('')
 const generate=async()=>{
  setGenerationError('')
  setIsGenerating(true)
  try {
   const result=await generateCoverLetter({
    applicantName:name,
    targetRole:role,
    company,
    jobDescription:description,
    experience,
    tone,
   })
   setLetter(result)
  } catch (error) {
   setGenerationError(error instanceof Error?error.message:'Unable to generate cover letter.')
  } finally {
   setIsGenerating(false)
  }
 }
 return <ResumashShell><div className="rs-container py-12 md:py-20">
  <div className="mb-8"><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>03 / Cover letter</p><h1 className="rs-editorial mt-3 text-5xl md:text-7xl">Your introduction, refined.</h1><p className="mt-4 max-w-xl text-sm leading-7" style={{color:'var(--rs-muted)'}}>Write a thoughtful cover letter around your real experience. No account needed.</p></div>
  <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
   <form className="rs-cover-controls rs-card space-y-5 p-6" onSubmit={e=>{e.preventDefault();void generate()}}>
    <div className="flex items-center gap-2"><Sparkles size={18}/><h2 className="font-semibold">Job details</h2></div>
    <label className="block text-sm">Your name<input required value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-lg border bg-transparent p-3" style={{borderColor:'var(--rs-line)'}} placeholder="Alex Chen"/></label>
    <label className="block text-sm">Job title<input required value={role} onChange={e=>setRole(e.target.value)} className="mt-2 w-full rounded-lg border bg-transparent p-3" style={{borderColor:'var(--rs-line)'}} placeholder="Senior Product Designer"/></label>
    <label className="block text-sm">Company<input required value={company} onChange={e=>setCompany(e.target.value)} className="mt-2 w-full rounded-lg border bg-transparent p-3" style={{borderColor:'var(--rs-line)'}} placeholder="Company name"/></label>
    <label className="block text-sm">Job description<textarea value={description} onChange={e=>setDescription(e.target.value)} rows={5} className="mt-2 w-full rounded-lg border bg-transparent p-3" style={{borderColor:'var(--rs-line)'}} placeholder="Paste the job description..."/></label>
    <label className="block text-sm">Your relevant experience<textarea value={experience} onChange={e=>setExperience(e.target.value)} rows={4} className="mt-2 w-full rounded-lg border bg-transparent p-3" style={{borderColor:'var(--rs-line)'}} placeholder="Share accurate details about your work and achievements..."/></label>
    <fieldset><legend className="mb-2 text-sm">Tone</legend><div className="grid grid-cols-2 gap-2">{(['Professional','Conversational','Enthusiastic','Concise'] as const).map(t=><button type="button" aria-pressed={tone===t} key={t} onClick={()=>setTone(t)} className={`rs-button text-xs ${tone===t?'rs-button-primary':'rs-button-outline'}`}>{t}</button>)}</div></fieldset>
    <button type="submit" className="rs-button rs-button-primary w-full" disabled={isGenerating||description.trim().length<20||experience.trim().length<20}><Sparkles size={16}/>{isGenerating?'Generating letter…':'Generate with AI'}</button>
    {generationError&&<p role="alert" className="text-sm text-red-500">{generationError}</p>}<p className="text-xs leading-5" style={{color:'var(--rs-muted)'}}>This is an AI draft based on your answers. Review every factual statement before using it.</p>
   </form>
   <section className="rs-cover-preview rs-card overflow-hidden p-4 md:p-8"><div className="rs-cover-toolbar mb-5 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><FileText size={17}/><h2 className="font-semibold">Cover letter preview</h2></div><button type="button" className="rs-button rs-button-outline !min-h-[36px] !px-3" disabled={!letter.trim()} onClick={()=>window.print()}>Print / PDF</button></div>
    <div className="rs-letter-page mx-auto min-h-[650px] max-w-[610px] bg-white px-6 py-10 text-black shadow-xl sm:px-12"><div className="border-b pb-6 text-2xl font-semibold tracking-tight">{name || 'Your Name'}</div><div className="rs-letter-print whitespace-pre-wrap text-[14px] leading-8">{letter}</div><textarea aria-label="Edit your cover letter" value={letter} onChange={e=>setLetter(e.target.value)} className="mt-9 min-h-[470px] w-full resize-y border-0 bg-transparent text-[14px] leading-8 outline-none" placeholder="Your cover letter will appear here. Enter your details and choose Create letter draft." /></div>
   </section>
  </div>
 </div></ResumashShell>
}