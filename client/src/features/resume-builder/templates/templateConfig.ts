import type { ResumeTemplateId } from './registry'

/**
 * Shared template contract for browser previews and downloadable PDFs.
 * Content is always the candidate's verified editor state; templates change
 * only the visual treatment and the relative order of existing sections.
 */
export const sectionKeys = ['summary','experience','education','projects','skills','additional'] as const
export type ResumeSectionKey = typeof sectionKeys[number]

interface TemplateConfig {
  displayName: string
  sections: readonly ResumeSectionKey[]
  summaryTitle: string
  pagePadding: { top: number; bottom: number; horizontal: number }
  fontFamily: 'Helvetica' | 'Times-Roman'
  ink: string
  accent: string
  nameFontSize: number
  sectionSpacing: number
}

export const templateConfigs: Record<ResumeTemplateId, TemplateConfig> = {
  modern: {
    displayName: 'Recruiter Standard',
    sections: ['summary','experience','skills','projects','education','additional'],
    summaryTitle:'Professional Summary',
    pagePadding:{top:42,bottom:43,horizontal:47},
    fontFamily:'Helvetica',
    ink:'#182329',
    accent:'#283841',
    nameFontSize:29,
    sectionSpacing:13,
  },
  classic: {
    displayName: 'Graduate & Emerging Talent',
    sections: ['summary','education','projects','skills','experience','additional'],
    summaryTitle:'Profile',
    pagePadding:{top:38,bottom:40,horizontal:47},
    fontFamily:'Times-Roman',
    ink:'#203946',
    accent:'#304752',
    nameFontSize:29,
    sectionSpacing:12,
  },
  executive: {
    displayName: 'Leadership Profile',
    sections: ['summary','experience','projects','skills','education','additional'],
    summaryTitle:'Leadership Profile',
    pagePadding:{top:48,bottom:48,horizontal:52},
    fontFamily:'Times-Roman',
    ink:'#242d25',
    accent:'#576653',
    nameFontSize:38,
    sectionSpacing:19,
  },
}

export function orderedResumeSections(template: ResumeTemplateId): readonly ResumeSectionKey[] {
  return templateConfigs[template].sections
}
