import { createElement, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import { toast } from 'sonner'
import useInputStore from '../stores/useInputStores'
import useFieldStores from '../stores/useMultipleFieldStore'
import { useTagStore } from '../stores/useInputTags'
import type { ResumeTemplateId } from '@/features/resume-builder/templates/registry'

/**
 * Generates a selectable-text PDF entirely within the browser.
 *
 * Benefits:
 * - Resume data does not travel to the backend simply to be exported.
 * - No Playwright/Chromium process or PDF-rendering server cost.
 * - Existing editor state and the selected template are captured together.
 *
 * Heavy PDF-generation code is loaded only after a user clicks Download.
 *
 * @param fileName - Suggested filename shown in the browser's save dialog.
 * @param setIsDownloading - UI callback for disabling duplicate clicks.
 * @param template - User's current Classic, Modern or Executive template.
 */
export async function downloadResume(
  fileName: string,
  setIsDownloading: (value: boolean) => void,
  template: ResumeTemplateId = 'modern',
): Promise<void> {
  setIsDownloading(true)
  try {
    // Both renderer and PDF library remain outside the initial page bundle.
    const [{ pdf }, { default: ResumePdfDocument }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/features/resume-builder/export/ResumePdfDocument'),
    ])

    // One immutable snapshot prevents independent store reads during rendering.
    const snapshot = {
      inputValue: { ...useInputStore.getState().inputValue },
      fields: structuredClone(useFieldStores.getState().fields),
      tagFields: structuredClone(useTagStore.getState().fields),
    }
    if (!snapshot.inputValue.fullName?.trim()) {
      throw new Error('Please enter your name before exporting the resume.')
    }

    // ResumePdfDocument always returns a React PDF <Document> root.
    const documentElement = createElement(ResumePdfDocument, { snapshot, template }) as ReactElement<DocumentProps>
    const blob = await pdf(documentElement).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    document.body.appendChild(link)
    link.click()
    link.remove()

    // Delayed cleanup allows the browser to finish resolving the download.
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
    toast.success('Resume PDF generated')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'PDF generation failed'
    toast.error(message)
  } finally {
    setIsDownloading(false)
  }
}
