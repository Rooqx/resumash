import { z } from 'zod'

// Preserve the three existing saved IDs while introducing two new choices.
// Older drafts therefore remain readable after the design upgrade.
export const templateSchema = z.enum(['executive','classic','modern','executive-modern','ats-essential'])
export type ResumeTemplateId = z.infer<typeof templateSchema>

export const resumeTemplates = [
  {id:'executive',name:'Executive Prestige',category:'Executive / Leadership',ats:'Design-led',description:'Charcoal portrait rail, warm-gold headings and refined director profile.',bestFor:'Executive portfolios, leadership applications and direct referrals'},
  {id:'classic',name:'Professional Classic',category:'ATS-Friendly / Corporate',ats:'ATS-focused',description:'Editorial serif masthead, precise rules and one-column structure.',bestFor:'Corporate applications, administrators and professional roles'},
  {id:'modern',name:'Modern Sidebar',category:'Modern / Creative Professional',ats:'Visual layout',description:'Wide typographic header with a soft-stone information rail.',bestFor:'Design-conscious professionals and human-reviewed applications'},
  {id:'executive-modern',name:'Executive Modern',category:'Premium / Management',ats:'Design-led',description:'Deep-blue banner, antique-gold name and structured side rail.',bestFor:'Management, operations and premium professional portfolios'},
  {id:'ats-essential',name:'ATS Essential',category:'Traditional / ATS-Friendly',ats:'ATS-focused',description:'Centered monochrome masthead, restrained rules and linear content.',bestFor:'Online applications, traditional industries and automated screening'},
] as const satisfies ReadonlyArray<{id:ResumeTemplateId;name:string;category:string;ats:string;description:string;bestFor:string}>

export const resumeTemplateSchema = z.object({
  templateId: templateSchema.default('ats-essential'),
})
