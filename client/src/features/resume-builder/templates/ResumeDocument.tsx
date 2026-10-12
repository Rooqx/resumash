import { useEffect, type ReactNode, type CSSProperties } from 'react'
import { templateSchema, type ResumeTemplateId } from './registry'
import { mainResumeSections, sidebarResumeSections, templateConfigs, type ResumeSectionKey } from './templateConfig'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import { tailoredResumeSchema } from '@/features/resume-tailor/schemas'
import type { ResumeSnapshot } from '../export/ResumePdfDocument'
import './resume-document.css'

type ResumeDocumentProps = {template?:ResumeTemplateId;printPayload?:boolean;snapshot?:ResumeSnapshot}
type Field=Record<string,unknown>
const EMPTY_INPUT:Record<string,string>={}
const EMPTY_FIELDS:Record<string,Field[]>={}
const EMPTY_TAGS:Record<string,{tags:string[];input:string;suggestions:string[]}>={}
const text=(value:unknown)=>typeof value==='string'?value.trim():''
const join=(values:unknown[],separator=' · ')=>(values.map(text).filter(Boolean)).join(separator)
const asFields=(values:unknown):Field[]=>Array.isArray(values)?values.filter((item):item is Field=>typeof item==='object'&&item!==null&&!Array.isArray(item)):[]
const safePortrait=(value:unknown)=>typeof value==='string' && /^data:image\\/(?:png|jpeg);base64,[A-Za-z0-9+/=]{1,650000}$/.test(value)?value:undefined\nconst safeUrl=(raw:unknown)=>{try{const value=new URL(text(raw));return ['http:','https:'].includes(value.protocol)?value.href:undefined}catch{return undefined}}

function Section({title,children}:{title:string;children:ReactNode}){
 return <section className="resume-section"><h2>{title}</h2>{children}</section>
}
function Entry({heading,subheading,date,detail,items}:{heading:string;subheading?:string;date?:string;detail?:string;items?:string[]}){
 return <div className="resume-entry">
  <div className="resume-entry-top">
   <div className="resume-entry-name"><h3>{heading}</h3>{subheading&&<p className="resume-subheading">{subheading}</p>}</div>
   {date&&<span className="resume-date">{date}</span>}
  </div>
  {detail&&<p className="resume-paragraph">{detail}</p>}
  {!!items?.length&&<ul className="resume-bullets">{items.filter(Boolean).map((item,i)=><li key={i}>{item}</li>)}</ul>}
 </div>
}
export default function ResumeDocument({template='ats-essential',printPayload=false,snapshot}:ResumeDocumentProps){
 const savedInput=useInputStore(s=>snapshot?EMPTY_INPUT:s.inputValue)
 const savedFields=useFieldStores(s=>snapshot?EMPTY_FIELDS:s.fields)
 const savedTags=useTagStore(s=>snapshot?EMPTY_TAGS:s.fields)
 const input=snapshot?.inputValue??savedInput
 const fields=snapshot?.fields??savedFields
 const tags=snapshot?.tagFields??savedTags
 const setInput=useInputStore(s=>s.setInputData)
 const setFields=useFieldStores(s=>s.setFields)
 const setTags=useTagStore(s=>s.setTags)
 useEffect(()=>{
  if(!printPayload)return
  const encoded=new URLSearchParams(window.location.search).get('data')
  if(!encoded)return
  try{
   const payload:unknown=JSON.parse(encoded)
   const parsed=tailoredResumeSchema.safeParse(payload)
   if(parsed.success){setInput(parsed.data.inputValue);setFields(parsed.data.fields);setTags(parsed.data.tagFields??{})}
  }catch{/* Bad print payloads cannot overwrite the draft. */}
 },[printPayload,setInput,setFields,setTags])

 const selected=templateSchema.safeParse(template).data??'ats-essential'
 const config=templateConfigs[selected]
 const entries={
  experience:asFields(fields.experience),education:asFields(fields.education),
  skills:asFields(fields.skills),projects:asFields(fields.projects),
  certificates:asFields(fields.certificates),awards:asFields(fields.awards),
 }
 const name=text(input.fullName)||'Your Name'
 const initials=name.split(/\s+/).slice(0,2).map(part=>part.charAt(0)).join('').toUpperCase()
 const nameWords=name.split(/\s+/)
 const familyName=nameWords.length>1?nameWords.pop():''
 const givenNames=nameWords.join(' ')
 const location=join([input.city,input.country],', ')
 const contact=[input.phone,input.email,location].map(text).filter(Boolean)
 const links=[['LinkedIn',input.linkdlnUrl],['GitHub',input.githubUrl],['Portfolio',input.portfolioUrl]] as const
 const contactBlock=<div className="rs-contact-lines">
  {contact.map((line,i)=><p key={i}>{line}</p>)}
  {links.map(([label,value])=>{const href=safeUrl(value);return href?<p key={label}><a href={href}>{label} · {text(value).replace(/^https?:\/\//,'')}</a></p>:null})}
 </div>
 const summary=text(input.summary)&&<Section title={config.summaryTitle}><p className="resume-paragraph">{text(input.summary)}</p></Section>
 const experience=entries.experience.length>0&&<Section title={selected==='ats-essential'?'Work Experience':selected==='modern'?'Professional History':'Professional Experience'}>
  {entries.experience.map((item,i)=><Entry key={i} heading={text(item.jobPosition)||text(item.companyName)}
   subheading={text(item.companyName)} date={join([item.jobStartDate,item.jobEndDate||'Present'],' – ')}
   detail={text(item.jobSummary)} items={tags[`jobHighlights-${i}`]?.tags}/>)}
 </Section>
 const education=entries.education.length>0&&<Section title="Education">
  {entries.education.map((item,i)=><Entry key={i} heading={text(item.institution)}
   subheading={join([item.studyType,item.area],' in ')} date={join([item.startDate,item.endDate],' – ')}
   detail={text(item.gpa)?`GPA: ${text(item.gpa)}`:undefined}/>)}
 </Section>
 const skills=entries.skills.length>0&&<Section title={selected==='modern'?'Core Skills':'Skills'}>
  {entries.skills.map((item,i)=><div className="resume-skill" key={i}><strong>{text(item.skillName)}</strong>
   {tags[`skills-${i}`]?.tags?.length>0&&<span>{tags[`skills-${i}`]?.tags?.join(', ')}</span>}</div>)}
 </Section>
 const projects=entries.projects.length>0&&<Section title="Projects">
  {entries.projects.map((item,i)=><Entry key={i} heading={text(item.name)} detail={text(item.description)}
   items={tags[`projectHighlights-${i}`]?.tags}/>)}
 </Section>
 const additional=(entries.certificates.length>0||entries.awards.length>0)&&<Section title={selected==='executive'?'Professional Development':'Additional'}>
  {entries.certificates.map((item,i)=><Entry key={`c-${i}`} heading={text(item.certificateName)} subheading={text(item.certificateIssuer)} date={text(item.certificateDate)}/>)}
  {entries.awards.map((item,i)=><Entry key={`a-${i}`} heading={text(item.awardTitle)} subheading={text(item.awarder)} date={text(item.awardDate)} detail={text(item.awardSummary)}/>)}
 </Section>
 const nodes:Record<ResumeSectionKey,ReactNode>={summary,experience,education,skills,projects,additional}
 const render=(keys:readonly ResumeSectionKey[])=><>{keys.map(key=><div className="resume-slot" key={key}>{nodes[key]}</div>)}</>
 const additionalInfo=text(input.additionalInfo)&&<Section title="Additional Information"><p className="resume-paragraph">{text(input.additionalInfo)}</p></Section>
 const header=<header className="resume-header">
  {selected==='executive-modern'&&<div className="rs-monogram">{initials}</div>}
  <div className="rs-name-block"><h1>{selected==='executive'&&familyName?<><span>{givenNames} </span><span className="rs-family-name">{familyName}</span></>:name}</h1>{text(input.label)&&<p className="resume-role">{text(input.label)}</p>}</div>
  {(selected==='classic'||selected==='modern'||selected==='ats-essential')&&<div className="resume-contacts">
    {selected==='ats-essential'?<p>{[input.phone,location,input.email,text(input.linkdlnUrl)].map(text).filter(Boolean).join('  |  ')}</p>:contactBlock}
  </div>}
 </header>
 const photo=safePortrait(input.profilePhotoDataUrl)\n const sidebar=<aside className="rs-sidebar">
  {selected==='executive'&&<div className="rs-portrait" aria-label="Portrait placeholder">{photo?<img src={photo} alt="" />:<span>{initials}</span>}</div>}
  {(selected==='executive'||selected==='executive-modern')&&<section className="rs-sidebar-contact"><h2>Contact</h2>{contactBlock}</section>}
  {render(sidebarResumeSections(selected))}
 </aside>
 return <article className={`rs-document rs-template-${selected}`} style={{
  '--resume-ink':config.ink,'--resume-accent':config.accent,
  '--resume-name-size':`${config.nameFontSize*4/3}px`,
  '--resume-section-space':`${config.sectionSpacing*4/3}px`,
  '--resume-pad-top':`${config.pagePadding.top*4/3}px`,
  '--resume-pad-bottom':`${config.pagePadding.bottom*4/3}px`,
  '--resume-pad-horizontal':`${config.pagePadding.horizontal*4/3}px`,
 } as CSSProperties} aria-label={`${config.displayName} resume preview`}>
  {selected==='executive'?<div className="rs-layout rs-charcoal">{sidebar}<main className="rs-main">{header}{render(mainResumeSections(selected))}{additionalInfo}</main></div>:
   selected==='modern'?<>{header}<div className="rs-layout rs-stone">{sidebar}<main className="rs-main">{render(mainResumeSections(selected))}{additionalInfo}</main></div></>:
   selected==='executive-modern'?<>{header}<div className="rs-layout rs-navy">{sidebar}<main className="rs-main">{render(mainResumeSections(selected))}{additionalInfo}</main></div></>:
   <div className="rs-single">{header}<main>{render(mainResumeSections(selected))}{additionalInfo}</main></div>}
 </article>
}
