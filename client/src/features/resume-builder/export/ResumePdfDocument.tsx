import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import type { ResumeTemplateId } from '../templates/registry'
import { templateConfigs, mainResumeSections, sidebarResumeSections, type ResumeSectionKey } from '../templates/templateConfig'

/** Same verified editor snapshot is used for HTML and selectable-text A4 PDFs. */
export interface ResumeSnapshot {
  inputValue: Record<string,string>
  fields: Record<string,Array<Record<string,unknown>>>
  tagFields: Record<string,{tags:string[]}>
}
interface Props {snapshot:ResumeSnapshot;template:ResumeTemplateId}
const txt=(v:unknown):string=>typeof v==='string'?v.trim():''
const join=(vs:unknown[],sep=' · '):string=>vs.map(txt).filter(Boolean).join(sep)
const entries=(snap:ResumeSnapshot,key:string)=>Array.isArray(snap.fields[key])?
  snap.fields[key].filter(v=>v&&typeof v==='object'&&!Array.isArray(v)):[]
const styles=StyleSheet.create({
  page:{backgroundColor:'#fff',color:'#252525',fontFamily:'Helvetica',fontSize:9,lineHeight:1.42},
  section:{marginBottom:12},
  title:{fontFamily:'Helvetica-Bold',fontSize:9.2,textTransform:'uppercase',letterSpacing:1,borderBottomWidth:.6,borderBottomColor:'#a0a0a0',paddingBottom:4,marginBottom:7},
  entry:{marginBottom:9},
  entryTitle:{fontFamily:'Helvetica-Bold',fontSize:9.5},
  subheading:{fontSize:8.8,color:'#565656',marginTop:1},
  date:{fontSize:8,color:'#666',marginTop:2},
  body:{fontSize:8.85,lineHeight:1.45,marginTop:3},
  bullet:{fontSize:8.6,lineHeight:1.42,marginTop:2,marginLeft:9},
  skill:{fontSize:8.6,marginBottom:4},
  contact:{fontSize:8.1,lineHeight:1.5},
  leftRule:{borderBottomWidth:.7,borderBottomColor:'#777'},
  sidebarTitle:{fontSize:8.3,letterSpacing:1.4,fontFamily:'Helvetica-Bold',textTransform:'uppercase',borderBottomWidth:.6,borderBottomColor:'#a4a4a4',paddingBottom:4,marginBottom:8},
})

function Section({title,template,sidebar=false,children}:{title:string;template:ResumeTemplateId;sidebar?:boolean;children:ReactNode}){
 const executive=template==='executive', editorial=template==='classic',ats=template==='ats-essential'
 return <View style={[styles.section,{marginBottom:sidebar?12:templateConfigs[template].sectionSpacing*.8}]}>
   <Text style={[
     sidebar?styles.sidebarTitle:styles.title,
     editorial||ats?{fontFamily:'Times-Bold'}:{},
     executive?{color:sidebar?'#d9c18d':'#b29a64',fontFamily:'Helvetica',letterSpacing:sidebar?1.5:2.2}:{},
     template==='executive-modern'&&!sidebar?{borderBottomColor:'#afafaf'}:{},
     ats?{fontSize:10.4,letterSpacing:.5,borderBottomColor:'#333'}:{},
     sidebar&&executive?{borderBottomColor:'#7c8085'}:{},
   ]}>{title}</Text>{children}
  </View>
}
function Entry({title,subtitle,date,description,bullets=[],template,sidebar=false}:{title:string;subtitle?:string;date?:string;description?:string;bullets?:string[];template:ResumeTemplateId;sidebar?:boolean}){
 const serif=template==='classic'||template==='ats-essential'
 return <View style={[styles.entry,{marginBottom:sidebar?8:10}]} wrap={false}>
  {!!title&&<Text style={[styles.entryTitle,serif?{fontFamily:'Times-Bold'}:{},sidebar?{fontSize:8.5}:{}]}>{title}</Text>}
  {!!subtitle&&<Text style={[styles.subheading,sidebar?{fontSize:7.8}:{}]}>{subtitle}</Text>}
  {!!date&&<Text style={[styles.date,sidebar?{fontSize:7.5}:{}]}>{date}</Text>}
  {!!description&&<Text style={[styles.body,sidebar?{fontSize:8}:{}]}>{description}</Text>}
  {bullets.filter(Boolean).map((bullet,i)=><Text key={i} style={[styles.bullet,sidebar?{fontSize:7.8}:{}]}>• {bullet}</Text>)}
 </View>
}
function Contact({input,light=false}:{input:Record<string,string>;light?:boolean}){
 const items=[input.phone,input.email,join([input.city,input.country],', '),input.linkdlnUrl,input.githubUrl,input.portfolioUrl].map(txt).filter(Boolean)
 return <View>{items.map((item,i)=><Text key={i} style={[styles.contact,light?{color:'#dadada',fontSize:7.6}:{color:'#555'}]}>{item}</Text>)}</View>
}
function ContentSections({snapshot,template,keys,sidebar=false}:{snapshot:ResumeSnapshot;template:ResumeTemplateId;keys:readonly ResumeSectionKey[];sidebar?:boolean}){
 const input=snapshot.inputValue, config=templateConfigs[template]
 const exp=entries(snapshot,'experience'),edu=entries(snapshot,'education'),skills=entries(snapshot,'skills'),projects=entries(snapshot,'projects'),certs=entries(snapshot,'certificates'),awards=entries(snapshot,'awards')
 const summary=!!txt(input.summary)&&<Section title={config.summaryTitle} template={template} sidebar={sidebar}><Text style={[styles.body,sidebar?{fontSize:8}:{},template==='classic'||template==='ats-essential'?{fontFamily:'Times-Roman'}:{}]}>{txt(input.summary)}</Text></Section>
 const experience=exp.length>0&&<Section title={template==='ats-essential'?'Work Experience':template==='modern'?'Professional History':'Professional Experience'} template={template} sidebar={sidebar}>
  {exp.map((v,i)=><Entry key={i} template={template} sidebar={sidebar} title={txt(v.jobPosition)||txt(v.companyName)}
   subtitle={txt(v.companyName)} date={join([v.jobStartDate,v.jobEndDate||'Present'],' – ')} description={txt(v.jobSummary)}
   bullets={snapshot.tagFields[`jobHighlights-${i}`]?.tags||[]}/>)}
 </Section>
 const education=edu.length>0&&<Section title="Education" template={template} sidebar={sidebar}>
  {edu.map((v,i)=><Entry key={i} template={template} sidebar={sidebar} title={txt(v.institution)}
   subtitle={join([v.studyType,v.area],' in ')} date={join([v.startDate,v.endDate],' – ')} description={txt(v.gpa)?`GPA: ${txt(v.gpa)}`:undefined}/>)}
 </Section>
 const skillsSection=skills.length>0&&<Section title={template==='modern'?'Core Skills':'Skills'} template={template} sidebar={sidebar}>
  <View style={template==='classic'?{flexDirection:'row',flexWrap:'wrap'}:{}}>
   {skills.map((v,i)=><Text key={i} style={[styles.skill,sidebar?{fontSize:8}: {},
     template==='classic'?{width:'33%',paddingRight:6}:{}
   ]}>{txt(v.skillName)}{snapshot.tagFields[`skills-${i}`]?.tags?.length?
    `: ${snapshot.tagFields[`skills-${i}`].tags.join(', ')}`:''}</Text>)}
  </View>
 </Section>
 const projectsSection=projects.length>0&&<Section title="Projects" template={template} sidebar={sidebar}>
  {projects.map((v,i)=><Entry key={i} template={template} sidebar={sidebar} title={txt(v.name)} description={txt(v.description)}
   bullets={snapshot.tagFields[`projectHighlights-${i}`]?.tags||[]}/>)}
 </Section>
 const additional=(certs.length>0||awards.length>0)&&<Section title={template==='executive'?'Professional Development':'Additional'} template={template} sidebar={sidebar}>
  {certs.map((v,i)=><Entry key={`c${i}`} template={template} sidebar={sidebar} title={txt(v.certificateName)} subtitle={txt(v.certificateIssuer)} date={txt(v.certificateDate)}/>)}
  {awards.map((v,i)=><Entry key={`a${i}`} template={template} sidebar={sidebar} title={txt(v.awardTitle)} subtitle={txt(v.awarder)} date={txt(v.awardDate)} description={txt(v.awardSummary)}/>)}
 </Section>
 const content:Record<ResumeSectionKey,ReactNode>={summary,experience,education,skills:skillsSection,projects:projectsSection,additional}
 return <>{keys.map(key=><View key={key}>{content[key]}</View>)}</>
}
function Header({snapshot,template}:{snapshot:ResumeSnapshot;template:ResumeTemplateId}){
 const input=snapshot.inputValue,fullName=txt(input.fullName)||'Your Name',role=txt(input.label)
 const side=template==='executive',banner=template==='executive-modern',ats=template==='ats-essential',editorial=template==='classic',stone=template==='modern'
 const parts=fullName.trim().split(/\s+/),last=parts.length>1?parts.pop():'',first=parts.join(' ')
 return <View style={[
  banner?{backgroundColor:'#2f4555',minHeight:149,paddingTop:16,paddingBottom:17,alignItems:'center',justifyContent:'center'}:{},
  side?{marginBottom:21}:{},editorial?{borderBottomWidth:.8,borderBottomColor:'#aaa',paddingBottom:12,marginBottom:17}:{},
  stone?{minHeight:125,marginHorizontal:40,paddingTop:29,paddingBottom:16,borderBottomWidth:.8,borderBottomColor:'#8f8f8f',marginBottom:0}:{},
  ats?{alignItems:'center',marginBottom:23}:{},
 ]}>
  {banner&&<View style={{backgroundColor:'#e7d29d',width:35,height:32,marginBottom:9,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:'Times-Bold',color:'#2f4555',fontSize:12}}>{fullName.trim().split(' ').filter(Boolean).slice(0,2).map(p=>p[0]).join('').toUpperCase()}</Text></View>}
  <Text style={[
   {fontFamily:side||stone?'Helvetica':'Times-Roman',fontSize:templateConfigs[template].nameFontSize*.76,color:templateConfigs[template].ink},
   side?{letterSpacing:3,textTransform:'uppercase'}:{},
   banner?{fontSize:29,color:'#e4cd92',letterSpacing:2.5,textAlign:'center'}:{},
   editorial?{fontSize:31}:{},stone?{fontSize:27,letterSpacing:3.3,textTransform:'uppercase'}:{},
   ats?{fontSize:35,letterSpacing:2.5,textTransform:'uppercase'}:{},
   {lineHeight:banner?41:ats?47:editorial?42:stone?38:36},
  ]}>{side&&last?<><Text>{first} </Text><Text style={{color:'#c5b17e'}}>{last}</Text></>:fullName}</Text>
  {!!role&&<Text style={[
   {fontSize:9,marginTop:6,letterSpacing:2,color:'#515151'},
   editorial?{fontFamily:'Times-Italic',letterSpacing:0,fontSize:9}:{},
   ats?{fontFamily:'Times-Roman',fontSize:13,letterSpacing:1.7,marginTop:6}:{},
   side?{letterSpacing:3.3,fontSize:7.2}:{},
   stone?{letterSpacing:3,fontSize:7.4,color:'#777'}:{},
   banner?{letterSpacing:3,fontSize:8,color:'#e4cd92',textAlign:'center'}:{},
   {lineHeight:ats?18:editorial?13:banner?13:12},
  ]}>{(side||stone||banner||ats)?role.toUpperCase():role}</Text>}
  {(editorial||stone)&&<View style={editorial?{position:'absolute',right:0,top:0,width:170,alignItems:'flex-end'}:{position:'absolute',right:0,top:30,width:132}}>
   <Contact input={input}/></View>}
  {ats&&<View style={{borderTopWidth:1.5,borderBottomWidth:1.5,borderColor:'#444',paddingVertical:7,marginTop:14,width:'100%'}}>
   <Text style={{textAlign:'center',fontFamily:'Times-Roman',fontSize:8.5}}>{join([input.phone,join([input.city,input.country],', '),input.email,input.linkdlnUrl],'  |  ')}</Text>
  </View>}
 </View>
}
function Sidebar({snapshot,template,offset=0}:{snapshot:ResumeSnapshot;template:ResumeTemplateId;offset?:number}){
 const prestige=template==='executive', navy=template==='executive-modern'
 const name=txt(snapshot.inputValue.fullName)||'Your Name',initials=name.split(/\s+/).slice(0,2).map(v=>v[0]).join('').toUpperCase()
 const width=prestige?175:navy?163:147
 const photoValue=snapshot.inputValue.profilePhotoDataUrl
 const portrait=typeof photoValue==='string'&&photoValue.length<=650000&&(photoValue.startsWith('data:image/jpeg;base64,')||photoValue.startsWith('data:image/png;base64,'))?photoValue:null
 const bg=prestige?'#262c34':navy?'#fff':'#ebebe8'
 // Fixed colored rail continues on subsequent pages; text remains selectable.
 return <>
  <View fixed style={{position:'absolute',left:prestige?0:navy?0:40,top:offset,
   width:navy?163:width,bottom:0,backgroundColor:bg}}/>
  <View style={{position:'absolute',left:prestige?16:navy?32:53,top:offset+(prestige?0:14),
   width:width-(prestige?32:navy?50:27),color:prestige?'#ddd':'#333'}}>
   {prestige&&<View style={{height:169,marginHorizontal:-16,backgroundColor:'#414850',alignItems:'center',justifyContent:'center',marginBottom:17}}>
    {portrait?<Image src={portrait} style={{width:175,height:169}}/>:<Text style={{color:'#d4c095',fontFamily:'Times-Roman',fontSize:29,letterSpacing:3}}>{initials}</Text>}
   </View>}
   {(prestige||navy)&&<View style={{marginBottom:17}}>
    <Text style={[styles.sidebarTitle,prestige?{color:'#dfc991',borderBottomColor:'#858585'}:{}]}>Contact</Text>
    <Contact input={snapshot.inputValue} light={prestige}/>
   </View>}
   <ContentSections snapshot={snapshot} template={template} sidebar keys={sidebarResumeSections(template)}/>
  </View>
 </>
}
export default function ResumePdfDocument({snapshot,template}:Props){
 const config=templateConfigs[template],prestige=template==='executive',stone=template==='modern',navy=template==='executive-modern'
 const hasSidebar=prestige||stone||navy
 const content=<>
  <ContentSections snapshot={snapshot} template={template} keys={mainResumeSections(template)}/>
  {!!txt(snapshot.inputValue.additionalInfo)&&<Section title="Additional Information" template={template}><Text style={styles.body}>{txt(snapshot.inputValue.additionalInfo)}</Text></Section>}
 </>
 return <Document creator="Resumash" title={txt(snapshot.inputValue.fullName)?`${txt(snapshot.inputValue.fullName)} — Resume`:'Resume'}>
  <Page size="A4" wrap style={[styles.page,{color:config.ink,backgroundColor:'#fff',fontFamily:config.fontFamily}]}>
   {hasSidebar&&<Sidebar snapshot={snapshot} template={template} offset={stone?133:navy?152:0}/>}
   {navy&&<Header snapshot={snapshot} template={template}/>}
   {stone&&<Header snapshot={snapshot} template={template}/>}
   <View style={hasSidebar?{
     marginLeft:prestige?175:stone?207:163,
     paddingTop:prestige?32:stone?16:navy?18:32,
     paddingRight:prestige?28:stone?40:navy?28:32,
     paddingBottom:config.pagePadding.bottom,
     paddingLeft:prestige?21:stone?0:navy?19:21,
   }:{
     paddingTop:config.pagePadding.top,paddingHorizontal:config.pagePadding.horizontal,
     paddingBottom:config.pagePadding.bottom,
   }}>
    {!hasSidebar&&<Header snapshot={snapshot} template={template}/>}
    {prestige&&<Header snapshot={snapshot} template={template}/>}
    {content}
   </View>
  </Page>
 </Document>
}
