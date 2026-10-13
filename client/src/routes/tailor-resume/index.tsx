import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, FileCheck, Sparkles, UploadCloud } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import ResumashShell from '@/components/ResumashShell'
import SEO from '@/components/SEO'
import { createTailorJobCredentials, getTailoringJob, submitTailoringJob } from '@/lib/serverActions/tailorResume'
import { tailoringResponseSchema, type TailoringResponse } from '@/features/resume-tailor/schemas'
import ResumeReview from '@/features/resume-tailor/components/ResumeReview'
import { applyApprovedChanges } from '@/features/resume-tailor/reviewChanges'
import { restoreTailorDraft, saveTailorDraft, clearTailorDraft, saveUploadedResume, restoreUploadedResume, clearUploadedResume, saveActiveTailorJob, restoreActiveTailorJob, clearActiveTailorJob, type TailorJobCredentials } from '@/lib/persistence/resumeDrafts'

export const Route=createFileRoute('/tailor-resume/')({component:TailorPage})
function TailorPage(){
 const [restored] = useState(() => restoreTailorDraft())
 const [jobDescription,setJobDescription]=useState(restored?.jobDescription??'')
 const [file,setFile]=useState<File|null>(null)
 const [result,setResult]=useState<TailoringResponse|null>(restored?.result??null)
 const [approved,setApproved]=useState(restored?.approved??false)
 const [acceptedEdits,setAcceptedEdits]=useState<Set<number>>(()=>new Set(restored?.acceptedEdits??[]))
 const [view,setView]=useState<'tailored'|'original'|'comparison'>(restored?.view??'tailored')
 const [originalUrl,setOriginalUrl]=useState<string|null>(null)
 const [storageWarning,setStorageWarning]=useState(false)
 const fileRevision=useRef(0)
 const generationRevision=useRef(0)
 const [activeJob,setActiveJob]=useState<TailorJobCredentials|null>(null)
 const [restoringJob,setRestoringJob]=useState(true)
 const [jobMessage,setJobMessage]=useState<string|null>(null)
 const query=useQueryClient()
 // Recover the anonymous capability before permitting another submission.
 useEffect(()=>{
  let cancelled=false
  void restoreActiveTailorJob().then(saved=>{
   if(!cancelled&&saved&&!restored?.result)setActiveJob(saved)
  }).catch(()=>setStorageWarning(true)).finally(()=>{if(!cancelled)setRestoringJob(false)})
  return ()=>{cancelled=true}
 },[restored])

 useEffect(()=>{
  if(!file){setOriginalUrl(null);return}
  const url=URL.createObjectURL(file)
  setOriginalUrl(url)
  return ()=>URL.revokeObjectURL(url)
 },[file])

 // Restore PDF bytes from IndexedDB, including its name and preview.
 useEffect(()=>{
  let cancelled=false
  const revision=fileRevision.current
  void restoreUploadedResume().then(saved=>{
    if(!cancelled&&revision===fileRevision.current&&saved)setFile(current=>current??saved)
  }).catch(()=>setStorageWarning(true))
  return ()=>{cancelled=true}
 },[])

 // Save after changes settle. All AI edit selections are restored separately.
 useEffect(()=>{
  const persistNow=()=>{
   if(!jobDescription.trim() && !result && !approved && acceptedEdits.size===0){
    clearTailorDraft()
    return
   }
   if(!saveTailorDraft({version:1,jobDescription,result,approved,acceptedEdits:[...acceptedEdits],view}))
    setStorageWarning(true)
  }
  const timer=window.setTimeout(persistNow,350)
  // Flush on refresh/close; otherwise a final keystroke could be lost.
  window.addEventListener('pagehide',persistNow)
  return ()=>{
   window.clearTimeout(timer)
   window.removeEventListener('pagehide',persistNow)
  }
 },[jobDescription,result,approved,acceptedEdits,view])

 const clearSavedWork=()=>{
  generationRevision.current++
  fileRevision.current++
  clearTailorDraft()
  void clearActiveTailorJob().catch(()=>setStorageWarning(true))
  setActiveJob(null)
  setJobMessage(null)
  query.removeQueries({queryKey:['resume-tailor-job']})
  void clearUploadedResume().catch(()=>{})
  setJobDescription('')
  setFile(null)
  setResult(null)
  setApproved(false)
  setAcceptedEdits(new Set())
  setView('tailored')
  toast.success('Locally saved tailoring draft cleared')
 }
 const navigate=useNavigate()
 const mutation=useMutation({
  mutationFn:async()=>{
   if(!file||!jobDescription.trim())throw new Error('Upload a resume and add the job description first.')
   const credentials=createTailorJobCredentials()
   setResult(null)
   setJobMessage(null)
   setActiveJob(credentials)
   // Persist before upload, allowing recovery from an ambiguous disconnect.
   try { await saveActiveTailorJob(credentials) }
   catch { setStorageWarning(true) }
   await submitTailoringJob({file,jobDescription,credentials})
  },
  onError:(error:Error)=>{
   if(axios.isAxiosError(error)&&error.response){
    setActiveJob(null)
    void clearActiveTailorJob().catch(()=>setStorageWarning(true))
    const message=typeof error.response.data?.message==='string'?error.response.data.message:error.message
    setJobMessage(message)
    toast.error(message)
   }else{
    setJobMessage('Connection interrupted. Checking whether your request was accepted…')
   }
  },
 })
 const statusQuery=useQuery({
  queryKey:['resume-tailor-job',activeJob?.jobId],
  queryFn:()=>getTailoringJob(activeJob!),
  enabled:!!activeJob&&!mutation.isPending,
  retry:false,
  refetchInterval:query=>{
   const state=query.state.data?.status
   return state==='completed'||state==='failed'?false:3000
  },
  refetchOnWindowFocus:true,
  staleTime:0,
 })
 useEffect(()=>{
  if(!activeJob||!statusQuery.data||statusQuery.data.jobId!==activeJob.jobId)return
  const {status,result:payload,error}=statusQuery.data
  if(status==='completed'){
   const parsed=tailoringResponseSchema.safeParse(payload)
   if(parsed.success){
    setResult(parsed.data)
    setApproved(false)
    setAcceptedEdits(new Set())
    query.removeQueries({queryKey:['tailoredResume'],exact:true})
    setJobMessage(null)
    toast.success('Your tailored resume is ready to review.')
   }else{
    setJobMessage('The server returned an invalid resume format.')
    toast.error('The server returned an invalid resume format.')
   }
  }else if(status==='failed'){
   const message=error||'Resume tailoring failed. Please try again.'
   setJobMessage(message)
   toast.error(message)
  }else return
  setActiveJob(null)
  void clearActiveTailorJob().catch(()=>setStorageWarning(true))
 },[activeJob,statusQuery.data,query])
 useEffect(()=>{
  if(!activeJob||!axios.isAxiosError(statusQuery.error))return
  const code=statusQuery.error.response?.status
  // After a refresh, the original POST may still be parsing a large PDF.
  if(code===404&&Date.now()-activeJob.submittedAt<90_000)return
  if(code===404||code===410||code===400){
   setJobMessage('Your previous tailoring job is unavailable. You can submit a new one.')
   setActiveJob(null)
   void clearActiveTailorJob().catch(()=>setStorageWarning(true))
  }
 },[activeJob,statusQuery.error])
 const working=!!activeJob||mutation.isPending||restoringJob
 return <ResumashShell>
  <SEO title="Tailor your resume | Resumash" description="Tailor your resume to a job description and refine the result." />
  <div className="rs-container py-10 md:py-16">
   <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs opacity-70">{storageWarning?'Local saving unavailable in this browser':'Draft automatically saved on this device'}</span><button type="button" className="rs-button rs-button-outline !min-h-9 text-xs" onClick={clearSavedWork}>Clear saved tailoring</button></div>
   <div className="mb-9"><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>01 / Resume tailoring</p><h1 className="rs-editorial mt-3 text-5xl md:text-7xl">The right story for the right role.</h1><p className="mt-4 max-w-2xl text-sm leading-7" style={{color:'var(--rs-muted)'}}>Upload your resume, add the job description, and review a tailored version built around your actual experience.</p></div>
   <div className={`grid items-start gap-5 ${view==='comparison' ? 'lg:grid-cols-[minmax(270px,.65fr)_minmax(0,2fr)]' : 'lg:grid-cols-[minmax(280px,1fr)_minmax(360px,1.3fr)_minmax(250px,.8fr)]'}`}>
    <form className="rs-card space-y-6 p-5 md:p-6" onSubmit={e=>{e.preventDefault();if(!working)mutation.mutate()}}>
     <div><span className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Step 01</span><h2 className="mt-2 text-lg font-semibold">Job description</h2><p className="mt-2 text-xs leading-5" style={{color:'var(--rs-muted)'}}>Paste the full details of the role you are applying for.</p></div>
     <textarea className="min-h-[260px] w-full resize-y rounded-xl border bg-transparent p-4 text-sm leading-7 outline-offset-2" style={{borderColor:'var(--rs-line)'}} value={jobDescription} disabled={working} onChange={e=>setJobDescription(e.target.value)} placeholder="Paste the job description here…" aria-label="Job description" required />
     <div><span className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Step 02</span><h2 className="mt-2 text-lg font-semibold">Your resume</h2></div>
     <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-6 text-center" style={{borderColor:'var(--rs-line)'}}>
      {file?<FileCheck size={25}/>:<UploadCloud size={25}/>}
      <span className="max-w-full break-all text-sm font-semibold">{file?file.name:'Choose your resume'}</span>
      <span className="text-xs" style={{color:'var(--rs-muted)'}}>PDF resume • up to 10 MB</span>
      <input type="file" className="sr-only" disabled={working} accept=".pdf,application/pdf" onChange={e=>{const next=e.target.files?.[0]??null;if(next&&next.size>10*1024*1024){toast.error('Maximum file size is 10 MB');setFile(null);return}generationRevision.current++;fileRevision.current++;setFile(next);setResult(null);setApproved(false);setAcceptedEdits(new Set());if(next){void saveUploadedResume(next).catch(()=>setStorageWarning(true))}else{void clearUploadedResume().catch(()=>{})}}}/>
     </label>
     <button className="rs-button rs-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={!file||!jobDescription.trim()||working} type="submit"><Sparkles size={17}/>{working?'Tailoring your resume…':'Tailor my resume'}<ArrowRight size={16}/></button>
     <div role="status" aria-live="polite" className="text-xs leading-6" style={{color:'var(--rs-muted)'}}>
      {working ? (restoringJob?'Restoring your saved session…':mutation.isPending?'Securely submitting your resume…':statusQuery.data?.status==='processing'?'AI is tailoring your resume. You can safely leave and return.':'Your job is queued or reconnecting. It will continue in the background.') : jobMessage}
      {activeJob&&statusQuery.error&&<p>Checking connection. Your job reference is saved on this device.</p>}
     </div>
    </form>
    <ResumeReview result={result ? { ...result, ...applyApprovedChanges(result, acceptedEdits) } : null} originalUrl={originalUrl} view={view} onViewChange={setView} onContinue={()=>{if(result&&approved){query.setQueryData(['tailoredResume'],applyApprovedChanges(result,acceptedEdits));navigate({to:'/build-resume'})}}} canContinue={approved} />
    <aside className={`rs-card p-5 md:p-6 ${view==='comparison' ? 'lg:col-span-2' : ''}`}><div className="flex items-center gap-2"><Sparkles size={18}/><h2 className="text-lg font-semibold">AI insights</h2></div><p className="mt-3 text-sm leading-7" style={{color:'var(--rs-muted)'}}>The AI uses the job description to rewrite relevant information from your existing resume.</p><div className="mt-6 space-y-4">{['Review every generated statement for accuracy.','Emphasize relevant experience and skills.','Add measurable results only when they are genuine.'].map((tip,index)=><div key={tip} className="flex gap-3 border-t pt-4 text-sm leading-6" style={{borderColor:'var(--rs-line)'}}><span className="text-xs" style={{color:'var(--rs-muted)'}}>0{index+1}</span><span>{tip}</span></div>)}</div>{result&&<div className="mt-6 space-y-4">
  <h3 className="font-semibold">Evidence-backed review</h3>
  <p className="text-xs opacity-75">All proposed edits start rejected. Accept only changes you have verified; unchanged source content is retained otherwise.</p>
  {result.suggestions.length===0?<p className="text-xs">No individually verified edits were returned. Inspect the entire generated draft carefully.</p>:result.suggestions.map((suggestion,i)=><div key={i} className="rounded-lg border p-3 text-xs" style={{borderColor:'var(--rs-line)'}}>
   <strong>{suggestion.priority.toUpperCase()} · {suggestion.section}</strong>
   <p className="mt-2">Original: {suggestion.original}</p>
   <p className="mt-2">Proposed: {suggestion.proposed}</p>
   <p className="mt-2 opacity-75">Why: {suggestion.reason}</p>
   <p className="mt-1 opacity-75">Evidence: {suggestion.sourceQuote}</p>
   <label className="mt-3 flex items-start gap-2 font-medium"><input type="checkbox" checked={acceptedEdits.has(i)} onChange={event=>{setAcceptedEdits(current=>{const next=new Set(current);if(event.target.checked)next.add(i);else next.delete(i);return next});setApproved(false)}}/><span>Accept this specific rewrite</span></label>
   {suggestion.requiresConfirmation&&<p className="mt-2 font-semibold">Requires your confirmation</p>}
  </div>)}
  {result.missingRequirements.length>0&&<div><h4 className="font-semibold">Unverified job requirements</h4>{result.missingRequirements.map((r,i)=><p className="mt-2 text-xs" key={i}>{r}</p>)}</div>}
  {result.clarificationQuestions.length>0&&<div><h4 className="font-semibold">Questions to clarify</h4>{result.clarificationQuestions.map((q,i)=><p className="mt-2 text-xs" key={i}>{q.question}</p>)}</div>}
  {result.writingNotes.map((note,i)=><p key={i} className="text-xs">{note}</p>)}
  <label className="flex items-start gap-2 text-xs leading-5"><input type="checkbox" checked={approved} onChange={e=>setApproved(e.target.checked)}/><span>I have reviewed the baseline and selected changes. Only checked edits will be applied to the editable resume.</span></label>
 </div>}</aside>
   </div>
  </div>
 </ResumashShell>
}
