import { z } from 'zod'

export const templateSchema = z.enum(['classic', 'modern', 'executive'])
export type ResumeTemplateId = z.infer<typeof templateSchema>

/** Purpose-driven, text-first layouts; IDs stay stable for saved drafts. */
export const resumeTemplates = [
 {id:'modern',name:'Recruiter Standard',description:'Sharp hierarchy and relevant experience up front.',bestFor:'Most professional roles, technology, operations and finance'},
 {id:'classic',name:'Graduate & Emerging Talent',description:'Education and projects get the visibility they deserve.',bestFor:'Students, graduates, internships and career transitions'},
 {id:'executive',name:'Leadership Profile',description:'Editorial typography and a concise leadership narrative.',bestFor:'Managers, senior specialists and executives'},
] as const satisfies ReadonlyArray<{id:ResumeTemplateId;name:string;description:string;bestFor:string}>


export const resumeTemplateSchema = z.object({
 templateId: templateSchema.default('modern'),
})
