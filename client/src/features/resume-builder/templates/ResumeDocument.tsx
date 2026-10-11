import { useEffect } from 'react'
import { templateSchema, type ResumeTemplateId } from './registry'
import { orderedResumeSections, templateConfigs } from './templateConfig'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import { tailoredResumeSchema } from '@/features/resume-tailor/schemas'
import './resume-document.css'
import type { ResumeSnapshot } from '../export/ResumePdfDocument'

type ResumeDocumentProps={template?:ResumeTemplateId; printPayload?:boolean; snapshot?:ResumeSnapshot}
type Field=Record<string,unknown>
// The sample gallery must not subscribe to changes in the user's private draft.
const EMPTY_INPUT:Record<string,string>={}
const EMPTY_FIELDS:Record<string,Array<Record<string,unknown>>>={}
const EMPTY_TAGS:Record<string,{tags:string[];input:string;suggestions:string[]}>={}
const asText=(value:unknown)=>typeof value==='string'?value.trim():''
const join=(values:unknown[],separator=' · ')=>(values.map(asText).filter(Boolean)).join(separator)
const asFields=(values:unknown):Field[]=>Array.isArray(values)?values.filter((item):item is Field=>typeof item==='object'&&item!==null&&!Array.isArray(item)):[]
const makeUrl=(url:unknown)=>{const value=asText(url);try{const normalized=new URL(value);return ['https:','http:'].includes(normalized.protocol)?normalized.href:undefined}catch{return undefined}}
function Section({title,children}:{title:string;children:React.ReactNode}){
 return <section className="resume-section"><h2>{title}</h2>{children}</section>
}
function Entry({heading,subheading,date,detail,items}:{heading:string;subheading?:string;date?:string;detail?:string;items?:string[]}){
 return <div className="resume-entry">
  <div className="resume-entry-top"><div><h3>{heading}</h3>{subheading&&<p className="resume-subheading">{subheading}</p>}</div>{date&&<span className="resume-date">{date}</span>}</div>
  {detail&&<p className="resume-paragraph">{detail}</p>}
  {!!items?.length&&<ul className="resume-bullets">{items.map((item,i)=><li key={i}>{item}</li>)}</ul>}
 </div>
}
export default function ResumeDocument({template='modern',printPayload=false,snapshot}:ResumeDocumentProps){
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
  }catch{ /* Ignore malformed print URL; don't crash the page. */ }
 },[printPayload,setInput,setFields,setTags])
 const style=templateSchema.safeParse(template).data??'modern'
 const sections={
  experience:asFields(fields.experience),
  education:asFields(fields.education),
  skills:asFields(fields.skills),
  projects:asFields(fields.projects),
  certificates:asFields(fields.certificates),
  awards:asFields(fields.awards),
 }
 const name=asText(input.fullName)||'Your Name'
 const contact=[input.email,input.phone,join([input.city,input.country],', ')]
 const links=[['LinkedIn',input.linkdlnUrl],['GitHub',input.githubUrl],['Portfolio',input.portfolioUrl]] as const
 const showExperience=sections.experience.length>0
 const showEducation=sections.education.length>0
 const showSkills=sections.skills.length>0
 const showProjects=sections.projects.length>0
 const showAdditional=sections.certificates.length>0||sections.awards.length>0
 const experience=<>{showExperience&&<Section title="Professional Experience">{sections.experience.map((item,i)=><Entry key={i} heading={asText(item.jobPosition)||asText(item.companyName)} subheading={asText(item.companyName)} date={join([item.jobStartDate,item.jobEndDate||'Present'],' – ')} detail={asText(item.jobSummary)} items={tags[`jobHighlights-${i}`]?.tags}/>)}</Section>}</>
 const education=<>{showEducation&&<Section title="Education">{sections.education.map((item,i)=><Entry key={i} heading={asText(item.institution)} subheading={join([item.studyType,item.area],' in ')} date={join([item.startDate,item.endDate],' – ')} detail={asText(item.gpa)?`GPA: ${asText(item.gpa)}`:undefined}/>)}</Section>}</>
 const skills=<>{showSkills&&<Section title="Skills">{sections.skills.map((item,i)=><div className="resume-skill" key={i}><strong>{asText(item.skillName)}</strong><span>{tags[`skills-${i}`]?.tags?.join(', ')||''}</span></div>)}</Section>}</>
 const projects=<>{showProjects&&<Section title="Projects">{sections.projects.map((item,i)=><Entry key={i} heading={asText(item.name)} detail={asText(item.description)} items={tags[`projectHighlights-${i}`]?.tags}/>)}</Section>}</>
 const additional=<>{showAdditional&&<Section title="Additional">{sections.certificates.map((item,i)=><Entry key={`c-${i}`} heading={asText(item.certificateName)} subheading={asText(item.certificateIssuer)} date={asText(item.certificateDate)}/>)}{sections.awards.map((item,i)=><Entry key={`a-${i}`} heading={asText(item.awardTitle)} subheading={asText(item.awarder)} date={asText(item.awardDate)} detail={asText(item.awardSummary)}/>)}</Section>}</>
 const summary=asText(input.summary)&&<Section title={templateConfigs[style].summaryTitle}><p className="resume-paragraph">{asText(input.summary)}</p></Section>
 return <article className={`rs-document rs-template-${style}`} aria-label={`${style} resume preview`}>
  <div className="rs-document-content">
   <header className="resume-header"><h1>{name}</h1>{asText(input.label)&&<p className="resume-role">{input.label}</p>}
    <p className="resume-contacts">{join(contact)}{links.map(([label,url])=>{const href=makeUrl(url);return href?<span key={label}> · <a href={href}>{label}</a></span>:null})}</p>
   </header>
   {orderedResumeSections(style).map(section=>(
    <div key={section} className="resume-section-slot">{({
     summary, experience, education, projects, skills,
     additional,
    } as Record<string,React.ReactNode>)[section]}</div>
   ))}
   {asText(input.additionalInfo)&&<Section title="Additional Information"><p className="resume-paragraph">{asText(input.additionalInfo)}</p></Section>}
  </div>
 </article>
}
