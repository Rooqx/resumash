import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, FileCheck, FileText, Sparkles, UploadCloud } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ResumashShell from '@/components/ResumashShell'
import SEO from '@/components/SEO'
import { getTailoredResume } from '@/lib/serverActions/tailorResume'

export const Route=createFileRoute('/tailor-resume/')({component:TailorPage})
type ResumeResult={inputValue?:Record<string,string>;fields?:Record<string,Array<Record<string,unknown>>>;tagFields?:Record<string,unknown>}
function isResume(value:unknown):value is ResumeResult {
 return typeof value==='object'&&value!==null&&'inputValue' in value&&'fields' in value
}
function TailorPage(){
 const [jobDescription,setJobDescription]=useState('')
 const [file,setFile]=useState<File|null>(null)
 const [result,setResult]=useState<ResumeResult|null>(null)
 const [view,setView]=useState<'tailored'|'original'>('tailored')
 const query=useQueryClient()
 const navigate=useNavigate()
 const mutation=useMutation({
  mutationFn:async()=>{
   if(!file||!jobDescription.trim())throw new Error('Upload a resume and add the job description first.')
   const response=await getTailoredResume({file,jobDescription})
   const payload:unknown=response?.data?.data
   if(!isResume(payload))throw new Error('The server did not return a valid resume.')
   return payload
  },
  onSuccess:(resume)=>{
   setResult(resume)
   query.setQueryData(['tailoredResume'],resume)
   toast.success('Your tailored resume is ready to review.')
  },
  onError:(error:Error)=>toast.error(error.message||'Resume tailoring failed. Please try again.'),
 })
 return <ResumashShell>
  <SEO title="Tailor your resume | Resumash" description="Tailor your resume to a job description and refine the result." />
  <div className="rs-container py-10 md:py-16">
   <div className="mb-9"><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>01 / Resume tailoring</p><h1 className="rs-editorial mt-3 text-5xl md:text-7xl">The right story for the right role.</h1><p className="mt-4 max-w-2xl text-sm leading-7" style={{color:'var(--rs-muted)'}}>Upload your resume, add the job description, and review a tailored version built around your actual experience.</p></div>
   <div className="grid items-start gap-5 lg:grid-cols-[minmax(280px,1fr)_minmax(360px,1.3fr)_minmax(250px,.8fr)]">
    <form className="rs-card space-y-6 p-5 md:p-6" onSubmit={e=>{e.preventDefault();mutation.mutate()}}>
     <div><span className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Step 01</span><h2 className="mt-2 text-lg font-semibold">Job description</h2><p className="mt-2 text-xs leading-5" style={{color:'var(--rs-muted)'}}>Paste the full details of the role you are applying for.</p></div>
     <textarea className="min-h-[260px] w-full resize-y rounded-xl border bg-transparent p-4 text-sm leading-7 outline-offset-2" style={{borderColor:'var(--rs-line)'}} value={jobDescription} onChange={e=>setJobDescription(e.target.value)} placeholder="Paste the job description here…" aria-label="Job description" required />
     <div><span className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Step 02</span><h2 className="mt-2 text-lg font-semibold">Your resume</h2></div>
     <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-6 text-center" style={{borderColor:'var(--rs-line)'}}>
      {file?<FileCheck size={25}/>:<UploadCloud size={25}/>}
      <span className="max-w-full break-all text-sm font-semibold">{file?file.name:'Choose your resume'}</span>
      <span className="text-xs" style={{color:'var(--rs-muted)'}}>PDF resume • up to 10 MB</span>
      <input type="file" className="sr-only" accept=".pdf,application/pdf" onChange={e=>{const next=e.target.files?.[0]??null;if(next&&next.size>10*1024*1024){toast.error('Maximum file size is 10 MB');setFile(null);return}setFile(next);setResult(null)}}/>
     </label>
     <button className="rs-button rs-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={!file||!jobDescription.trim()||mutation.isPending} type="submit"><Sparkles size={17}/>{mutation.isPending?'Tailoring your resume…':'Tailor my resume'}<ArrowRight size={16}/></button>
    </form>
    <section className="rs-card min-w-0 overflow-hidden p-4 md:p-6">
     <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Resume preview</h2>{result&&<button className="rs-button rs-button-primary !min-h-[38px] !px-3" onClick={()=>navigate({to:'/build-resume'})}>Continue editing <ArrowRight size={15}/></button>}</div>
     <div className="mb-4 flex gap-2"><button type="button" className={`rs-button !min-h-9 !px-3 !py-2 text-xs ${view==='tailored'?'rs-button-primary':'rs-button-outline'}`} onClick={()=>setView('tailored')}>Tailored</button><button type="button" className={`rs-button !min-h-9 !px-3 !py-2 text-xs ${view==='original'?'rs-button-primary':'rs-button-outline'}`} onClick={()=>setView('original')}>Original</button></div>
     <div className="mx-auto min-h-[630px] w-full max-w-[550px] bg-white px-6 py-10 text-black shadow-lg md:px-10">
      {view==='original'?<div className="flex h-96 flex-col items-center justify-center gap-3 text-center"><FileText size={32} className="text-neutral-500"/><p className="text-sm font-semibold">Original resume</p><p className="max-w-xs text-xs leading-6 text-neutral-500">Your uploaded resume remains unchanged. An in-browser PDF comparison viewer is not yet available.</p>{file&&<p className="text-xs text-neutral-500">{file.name}</p>}</div>:result?<><h3 className="font-serif text-3xl">{result.inputValue?.fullName||'Your Name'}</h3><p className="mt-1 text-sm text-neutral-600">{result.inputValue?.label}</p><p className="mt-3 text-xs text-neutral-500">{[result.inputValue?.email,result.inputValue?.phone,result.inputValue?.city].filter(Boolean).join(' · ')}</p>{result.inputValue?.summary&&<div className="mt-8"><h4 className="border-b pb-2 text-xs font-bold tracking-wider">SUMMARY</h4><p className="mt-3 text-xs leading-6">{result.inputValue.summary}</p></div>}{Object.entries(result.fields??{}).filter(([,entries])=>Array.isArray(entries)&&entries.length>0).map(([section,entries])=><div key={section} className="mt-8"><h4 className="border-b pb-2 text-xs font-bold tracking-wider">{section.toUpperCase()}</h4>{entries.map((entry,index)=><div key={index} className="mt-4 space-y-1 text-xs leading-6">{Object.entries(entry).filter(([,value])=>typeof value==='string'&&Boolean(value)).map(([key,value])=><p key={key}>{String(value)}</p>)}</div>)}</div>)}</>:<div className="flex h-96 flex-col items-center justify-center gap-4 text-center"><FileText size={35} className="text-neutral-400"/><p className="font-serif text-2xl">Your next chapter starts here.</p><p className="max-w-xs text-sm leading-6 text-neutral-500">Your tailored resume will appear here when the AI has finished processing your document.</p></div>}
     </div>
    </section>
    <aside className="rs-card p-5 md:p-6"><div className="flex items-center gap-2"><Sparkles size={18}/><h2 className="text-lg font-semibold">AI insights</h2></div><p className="mt-3 text-sm leading-7" style={{color:'var(--rs-muted)'}}>The AI uses the job description to rewrite relevant information from your existing resume.</p><div className="mt-6 space-y-4">{['Review every generated statement for accuracy.','Emphasize relevant experience and skills.','Add measurable results only when they are genuine.'].map((tip,index)=><div key={tip} className="flex gap-3 border-t pt-4 text-sm leading-6" style={{borderColor:'var(--rs-line)'}}><span className="text-xs" style={{color:'var(--rs-muted)'}}>0{index+1}</span><span>{tip}</span></div>)}</div><p className="mt-7 text-xs leading-6" style={{color:'var(--rs-muted)'}}>Detailed change-by-change suggestions require additional backend response data. No match scores or recommendations are fabricated.</p></aside>
   </div>
  </div>
 </ResumashShell>
}
