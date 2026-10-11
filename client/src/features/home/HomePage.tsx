import { ArrowRight, FilePenLine, FileText, Sparkles, WandSparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const highlights = [
 { title: 'Instant resume tailoring', description: 'Align your existing experience with the role you want, without starting over.', icon: WandSparkles, href: '/tailor-resume' as const, label: 'Tailor your resume' },
 { title: 'Resume builder', description: 'Build a professional resume with clear, guided sections and a live preview.', icon: FileText, href: '/build-resume' as const, label: 'Build from scratch' },
] as const

function ResumeArtwork() {
 return (
  <div className="rs-paper-stage" aria-hidden="true">
   <div className="rs-paper rs-paper-back">
    <p className="text-[10px] tracking-[.2em] text-neutral-500">COVER LETTER</p>
    <div className="mt-6 h-px bg-neutral-300" />
    {Array.from({length:12},(_,i)=><div key={i} className="rs-paper-rule" style={{width:`${88-(i%5)*9}%`}} />)}
   </div>
   <div className="rs-paper rs-paper-front">
    <div className="font-serif text-[29px] tracking-tight">Alex Chen</div>
    <p className="mt-1 text-[10px] text-neutral-500">PRODUCT DESIGNER</p>
    <div className="mt-5 h-px bg-neutral-300" />
    {['PROFILE','EXPERIENCE','EDUCATION','SKILLS'].map((section,index)=>(
      <div key={section} className="mt-6">
        <p className="text-[9px] font-bold tracking-[.18em]">{section}</p>
        {Array.from({length:index===1?5:3},(_,i)=><div key={i} className="rs-paper-rule" style={{width:`${94-(i%3)*13}%`}} />)}
      </div>
    ))}
   </div>
   <div className="rs-match-note">
     <div className="flex items-center gap-2"><Sparkles size={15}/><span className="text-xs font-semibold">Tailored for your next role</span></div>
     <p className="mt-3 text-[11px] leading-6 text-neutral-300">✓ Relevant experience<br/>✓ Stronger language<br/>✓ Clean formatting</p>
   </div>
  </div>
 )
}

export default function HomePage() {
 return (
  <>
   <section className="rs-container rs-hero">
    <div>
     <p className="rs-eyebrow text-neutral-500">Build a stronger tomorrow</p>
     <h1 className="rs-editorial rs-hero-title mt-6">Build.<br/>Tailor.<br/><em>Apply.</em></h1>
     <p className="rs-hero-copy">Create a professional resume, tailor it to your next opportunity, and write a thoughtful cover letter. No account required. Just a simpler way forward.</p>
     <div className="rs-actions mt-9 flex flex-wrap items-center gap-3">
       <Link to="/tailor-resume" className="rs-button rs-button-primary">Tailor my resume <ArrowRight size={16}/></Link>
       <Link to="/build-resume" className="rs-button rs-button-outline">Build a resume</Link>
       <a href="/cover-letter" className="rs-button rs-button-outline">Cover letter</a>
     </div>
     <p className="mt-6 text-xs" style={{color:'var(--rs-muted)'}}>No sign-up. Start creating right away.</p>
    </div>
    <ResumeArtwork />
   </section>
   <section className="rs-container">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div><p className="rs-eyebrow" style={{color:'var(--rs-muted)'}}>Everything you need</p><h2 className="rs-editorial mt-3 text-4xl md:text-5xl">Your next chapter, made easier.</h2></div>
      <span className="text-sm" style={{color:'var(--rs-muted)'}}>Three tools. One clear direction.</span>
    </div>
    <div className="rs-feature-grid">
      {highlights.map(({title,description,icon:Icon,href,label},index)=>(
       <Link key={title} to={href} className="rs-card rs-feature-card">
        <div className="flex w-full items-center justify-between"><Icon size={23} strokeWidth={1.5}/><span className="text-xs" style={{color:'var(--rs-muted)'}}>0{index+1}</span></div>
        <h3 className="mt-8 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6" style={{color:'var(--rs-muted)'}}>{description}</p>
        <span className="mt-5 flex items-center gap-2 text-xs font-semibold">{label}<ArrowRight size={13}/></span>
       </Link>
      ))}
      <a href="/cover-letter" className="rs-card rs-feature-card">
       <div className="flex w-full items-center justify-between"><FilePenLine size={23} strokeWidth={1.5}/><span className="text-xs" style={{color:'var(--rs-muted)'}}>03</span></div>
       <h3 className="mt-8 text-lg font-semibold">AI cover letter</h3>
       <p className="mt-2 text-sm leading-6" style={{color:'var(--rs-muted)'}}>Write a personalized letter that complements your resume and the job.</p>
       <span className="mt-5 flex items-center gap-2 text-xs font-semibold">Create a cover letter<ArrowRight size={13}/></span>
      </a>
    </div>
   </section>
  </>
 )
}