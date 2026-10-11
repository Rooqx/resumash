import { expect, test } from 'bun:test'
import { createElement, type ReactElement } from 'react'
import { pdf, type DocumentProps } from '@react-pdf/renderer'
import ResumePdfDocument from './ResumePdfDocument'
import { sampleResume } from '../templates/sampleResume'
import { resumeTemplates } from '../templates/registry'

/**
 * Render a genuine PDF from the same component used by Download.
 * This exercises fonts, React-PDF component composition, and byte generation.
 * It cannot replace mobile browser download or visual pagination inspection.
 */
for (const template of resumeTemplates) {
 test(`generates valid text PDF for ${template.name}`, async () => {
  const document = createElement(ResumePdfDocument, {
   snapshot:sampleResume,template:template.id,
  }) as ReactElement<DocumentProps>
  const blob = await pdf(document).toBlob()
  const header = new TextDecoder().decode(await blob.slice(0,5).arrayBuffer())
  expect(header).toBe('%PDF-')
  expect(blob.size).toBeGreaterThan(1000)
 }, 30000)
}
