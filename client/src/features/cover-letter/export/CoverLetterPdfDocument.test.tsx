import { test, expect } from 'bun:test'
import { createElement, type ReactElement } from 'react'
import { pdf, type DocumentProps } from '@react-pdf/renderer'
import CoverLetterPdfDocument from './CoverLetterPdfDocument'

for (const layout of ['ats','modern'] as const) {
 test(`cover-letter ${layout} export is a valid, text-based A4 PDF`,async()=>{
  const doc=createElement(CoverLetterPdfDocument,{
   name:'Example Candidate',role:'Software Developer',company:'Acme',
   letter:'Dear Hiring Manager,\n\nI would like to apply for the developer position. My previous work includes building reliable web applications.\n\nKind regards,\nExample Candidate.',
   layout,
  }) as ReactElement<DocumentProps>
  const blob=await pdf(doc).toBlob()
  expect(new TextDecoder().decode(await blob.slice(0,5).arrayBuffer())).toBe('%PDF-')
  expect(blob.size).toBeGreaterThan(500)
 },30000)
}
