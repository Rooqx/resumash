import { createElement, useEffect, useRef, useState, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import type { ResumeSnapshot } from '../export/ResumePdfDocument'
import type { ResumeTemplateId } from '../templates/registry'

/**
 * A page-accurate preview: same React-PDF renderer and data as Download.
 * Debounce builder updates and ignore stale in-flight renders.
 */
export default function ResumePdfPreview({ template, snapshot, label = 'Actual resume PDF pages' }: {
  template: ResumeTemplateId
  snapshot?: ResumeSnapshot
  label?: string
}) {
  const inputValue = useInputStore(s => s.inputValue)
  const fields = useFieldStores(s => s.fields)
  const tagFields = useTagStore(s => s.fields)
  const serialized = JSON.stringify(snapshot ?? {inputValue, fields, tagFields})
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [rendering, setRendering] = useState(true)
  const urlRef = useRef<string | null>(null)

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current) }, [])
  useEffect(() => {
    let cancelled = false
    setRendering(true)
    setError('')
    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          const stableSnapshot = JSON.parse(serialized) as ResumeSnapshot
          const [{pdf}, {default: ResumePdfDocument}] = await Promise.all([
            import('@react-pdf/renderer'), import('../export/ResumePdfDocument'),
          ])
          const document = createElement(ResumePdfDocument, {snapshot: stableSnapshot, template}) as ReactElement<DocumentProps>
          const blob = await pdf(document).toBlob()
          if (cancelled) return
          const header = new TextDecoder().decode(await blob.slice(0, 5).arrayBuffer())
          if (header !== '%PDF-' || blob.size < 500) throw new Error('Invalid PDF preview generated')
          const nextUrl = URL.createObjectURL(blob)
          const previousUrl = urlRef.current
          urlRef.current = nextUrl
          setPreviewUrl(nextUrl)
          if (previousUrl) URL.revokeObjectURL(previousUrl)
          setRendering(false)
        } catch (cause) {
          if (!cancelled) {
            setError(cause instanceof Error ? cause.message : 'Could not render PDF')
            setRendering(false)
          }
        }
      })()
    }, snapshot ? 100 : 550)
    return () => { cancelled = true; window.clearTimeout(timeout) }
  }, [serialized, template, Boolean(snapshot)])

  return <div className="min-w-0 rounded-lg border bg-white p-2 text-black" style={{borderColor:'var(--rs-line)'}}>
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2 text-xs">
      <span aria-live="polite">{rendering ? 'Preparing actual PDF pages…' : error ? 'PDF preview unavailable' : 'A4 · page-accurate PDF preview'}</span>
      {previewUrl && <a className="underline" href={previewUrl} target="_blank" rel="noopener noreferrer">Open PDF in new tab</a>}
    </div>
    {error && <p role="alert" className="px-3 pb-3 text-sm text-red-700">{error}</p>}
    {previewUrl && !rendering ? <iframe key={previewUrl} title={label} src={previewUrl} className="h-[710px] w-full rounded-md bg-white"/> :
      <div className="flex h-[400px] items-center justify-center text-sm" role="status">Preparing preview…</div>}
    <p className="px-2 pt-2 text-xs text-neutral-500">Preview and download use the same PDF layout engine. On mobile, open in a new tab if your browser cannot display embedded PDFs.</p>
  </div>
}
