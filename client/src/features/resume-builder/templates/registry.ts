import { z } from 'zod'

export const templateSchema = z.enum(['classic', 'modern', 'executive'])
export type ResumeTemplateId = z.infer<typeof templateSchema>

export const resumeTemplates = [
 {id:'classic',name:'Classic ATS',description:'Traditional, compact and straightforward.',bestFor:'Graduates, finance and conservative roles'},
 {id:'modern',name:'Modern Professional',description:'Refined sans-serif with calm section hierarchy.',bestFor:'Engineering, product and general roles'},
 {id:'executive',name:'Executive Minimal',description:'Strong leadership profile and spacious hierarchy.',bestFor:'Senior specialists and executives'},
] as const satisfies ReadonlyArray<{id:ResumeTemplateId;name:string;description:string;bestFor:string}>

export const resumeTemplateSchema = z.object({
 templateId: templateSchema.default('modern'),
})
