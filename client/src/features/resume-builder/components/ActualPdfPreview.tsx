import { useEffect, useState } from 'react'
import { createElement, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import type { ResumeTemplateId } from '../templates/registry'

/**
 * Opt-in PDF proof uses the exact React-PDF renderer used by Download.
 * A browser PDF viewer owns real A4 page boundaries, text and pagination.
 * No network call or second layout implementation is involved.
 */
export default function ActualPdfPreview({ template, onClose }: {
  template: ResumeTemplateId
  onClose: () => void
}) {
  const [url,setUrl]=useState<string|null>(null)
  const [error,setError]=useState('')
  useEffect(()=>{
    let disposed=false
    let objectUrl:string|null=null
    const render=async()=>{
      try {
        const snapshot={
          inputValue:{...useInputStore.getState().inputValue},
          fields:structuredClone(useFieldStores.getState().fields),
          tagFields:structuredClone(useTagStore.getState().fields),
        }
        const [{pdf},{default:ResumePdfDocument}]=await Promise.all([
          import('@react-pdf/renderer'),
          import('../export/ResumePdfDocument'),
        ])
        const document=createElement(ResumePdfDocument,{snapshot,template}) as ReactElement<DocumentProps>
        const blob=await pdf(document).toBlob()
        if(disposed)return
        objectUrl=URL.createObjectURL(blob)
        setUrl(objectUrl)
      } catch(cause) {
        if(!disposed)setError(cause instanceof Error?cause.message:'Unable to prepare PDF preview')
      }
    }
    void render()
    return ()=>{disposed=true;if(objectUrl)URL.revokeObjectURL(objectUrl)}
  },[template])
  return <div role="dialog" aria-modal="true" aria-label="Real PDF page preview" className="fixed inset-0 z-50 bg-black/80 p-2 md:p-6">
    <div className="mx-auto flex h-full max-w-5xl flex-col rounded-xl bg-[var(--rs-surface)] p-3 md:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div><h2 className="text-lg font-semibold">Actual PDF preview</h2><p className="text-xs opacity-70">Pages and breaks are rendered by the same engine as Download.</p></div>
        <button type="button" className="rs-button rs-button-outline" onClick={onClose}>Close</button>
      </div>
      {error?<p role="alert" className="text-sm text-red-500">{error}</p>:
       url?<iframe src={url} title="Selectable A4 resume PDF" className="min-h-0 w-full flex-1 rounded-md bg-white"/>:
       <p role="status" className="text-sm">Preparing page-accurate preview…</p>}
    </div>
  </div>
}
