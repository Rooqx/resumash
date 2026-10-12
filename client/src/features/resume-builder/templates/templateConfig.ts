import type { ResumeTemplateId } from './registry'

export const sectionKeys = ['summary','experience','education','projects','skills','additional'] as const
export type ResumeSectionKey = typeof sectionKeys[number]
export type ResumeLayout = 'charcoal-rail' | 'editorial' | 'stone-rail' | 'navy-banner' | 'monochrome'

interface TemplateConfig {
  displayName: string
  layout: ResumeLayout
  sections: readonly ResumeSectionKey[]
  sidebarSections: readonly ResumeSectionKey[]
  summaryTitle: string
  pagePadding: {top:number;bottom:number;horizontal:number}
  fontFamily: 'Helvetica' | 'Times-Roman'
  ink: string
  accent: string
  nameFontSize: number
  sectionSpacing: number
}

export const templateConfigs: Record<ResumeTemplateId,TemplateConfig> = {
  executive: {
    displayName:'Executive Prestige',layout:'charcoal-rail',
    sections:['summary','experience','projects','education','skills','additional'],
    sidebarSections:['education','skills'],
    summaryTitle:'Career Summary', pagePadding:{top:32,bottom:36,horizontal:31},
    fontFamily:'Helvetica',ink:'#34363a',accent:'#baa778',nameFontSize:28,sectionSpacing:13,
  },
  classic: {
    displayName:'Professional Classic',layout:'editorial',
    sections:['summary','skills','experience','education','projects','additional'],
    sidebarSections:[],summaryTitle:'Professional Overview',
    pagePadding:{top:43,bottom:38,horizontal:46},
    fontFamily:'Times-Roman',ink:'#343434',accent:'#77736d',nameFontSize:30,sectionSpacing:13,
  },
  modern: {
    displayName:'Modern Sidebar',layout:'stone-rail',
    sections:['summary','experience','projects','education','skills','additional'],
    sidebarSections:['education','skills','additional'],
    summaryTitle:'Summary', pagePadding:{top:39,bottom:36,horizontal:36},
    fontFamily:'Helvetica',ink:'#25282c',accent:'#343b40',nameFontSize:29,sectionSpacing:13,
  },
  'executive-modern': {
    displayName:'Executive Modern',layout:'navy-banner',
    sections:['summary','experience','projects','education','skills','additional'],
    sidebarSections:['education','skills'],
    summaryTitle:'Summary',pagePadding:{top:35,bottom:35,horizontal:28},
    fontFamily:'Times-Roman',ink:'#22252a',accent:'#d1b878',nameFontSize:32,sectionSpacing:12,
  },
  'ats-essential': {
    displayName:'ATS Essential',layout:'monochrome',
    sections:['summary','experience','education','skills','projects','additional'],
    sidebarSections:[],summaryTitle:'Professional Summary',
    pagePadding:{top:42,bottom:40,horizontal:44},
    fontFamily:'Times-Roman',ink:'#242424',accent:'#242424',nameFontSize:34,sectionSpacing:13,
  },
}

export function orderedResumeSections(template:ResumeTemplateId):readonly ResumeSectionKey[] {
  return templateConfigs[template].sections
}
export function mainResumeSections(template:ResumeTemplateId):ResumeSectionKey[] {
  const config=templateConfigs[template]
  return config.sections.filter(s=>!config.sidebarSections.includes(s))
}
export function sidebarResumeSections(template:ResumeTemplateId):readonly ResumeSectionKey[] {
  return templateConfigs[template].sidebarSections
}
