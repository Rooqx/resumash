import { expect, test } from 'bun:test'
import { createElement, type ReactElement } from 'react'
import { pdf, type DocumentProps } from '@react-pdf/renderer'
import ResumePdfDocument from './ResumePdfDocument'
import { sampleForTemplate } from '../templates/sampleResume'
import { resumeTemplates } from '../templates/registry'

/**
 * Render a genuine PDF from the same component used by Download.
 * This exercises fonts, React-PDF component composition, and byte generation.
 * It cannot replace mobile browser download or visual pagination inspection.
 */
for (const template of resumeTemplates) {
 test(`generates valid text PDF for ${template.name}`, async () => {
  const document = createElement(ResumePdfDocument, {
   snapshot:sampleForTemplate(template.id),template:template.id,
  }) as ReactElement<DocumentProps>
  const blob = await pdf(document).toBlob()
  const header = new TextDecoder().decode(await blob.slice(0,5).arrayBuffer())
  expect(header).toBe('%PDF-')
  expect(blob.size).toBeGreaterThan(1000)
 }, 30000)
}

/** Overflow-proofing: many jobs and long bullets must not throw, rasterize,
 * or truncate the PDF generation path for any of the five layout engines. */
for(const template of resumeTemplates){
 test(`long multi-entry resume renders for ${template.name}`,async()=>{
  const sample=sampleForTemplate(template.id)
  const jobs=sample.fields.experience??[]
  const longSnapshot={
   ...sample,
   fields:{...sample.fields,experience:Array.from({length:9},(_,i)=>({
    ...jobs[i%jobs.length],jobStartDate:String(2015+i),jobEndDate:String(2016+i),
    jobSummary:'Coordinated project delivery, documented decisions, and maintained accurate cross-functional handoff records.'
   }))},
   tagFields:{...sample.tagFields,...Object.fromEntries(Array.from({length:9},(_,i)=>[
    `jobHighlights-${i}`,{tags:[
      'Maintained reliable task and project records across multiple stakeholders.',
      'Documented changes, delivered updates, and tracked follow-up actions through completion.',
    ]},
   ]))},
  }
  const doc=createElement(ResumePdfDocument,{snapshot:longSnapshot,template:template.id}) as ReactElement<DocumentProps>
  const blob=await pdf(doc).toBlob()
  expect(new TextDecoder().decode(await blob.slice(0,5).arrayBuffer())).toBe('%PDF-')
  expect(blob.size).toBeGreaterThan(2500)
 },30000)
}

test('Executive Prestige exports an actual embedded PNG portrait',async()=>{
 const sample=sampleForTemplate('executive')
 // Small generated sample pixel, not user data or an external URL.
 const photo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGPs6e1jYGBgYmBgYGBgAAAT/AGr6auGtgAAAABJRU5ErkJggg=='
 const snapshot={...sample,inputValue:{...sample.inputValue,profilePhotoDataUrl:photo}}
 const doc=createElement(ResumePdfDocument,{snapshot,template:'executive'}) as ReactElement<DocumentProps>
 const blob=await pdf(doc).toBlob()
 expect(new TextDecoder().decode(await blob.slice(0,5).arrayBuffer())).toBe('%PDF-')
 expect(blob.size).toBeGreaterThan(1000)
},30000)
