import React, { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './PDFPreview.css'

interface PDFPreviewProps {
  children: ReactNode
  className?: string
  showPageNumbers?: boolean
}

interface Page {
  id: number
  content: Array<ReactNode>
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  children,
  className = '',
  showPageNumbers = true,
}) => {
  // typed state for pages
  const [pages, setPages] = useState<Array<Page>>([{ id: 1, content: [] }])

  // typed refs
  const contentRef = useRef<HTMLDivElement | null>(null)
  const pageRefs = useRef<Array<HTMLDivElement | null>>([])

  // Standard A4 dimensions in pixels at 96 DPI
  const PAGE_WIDTH = 794 // 210mm
  const PAGE_HEIGHT = 1123 // 297mm
  const PAGE_MARGIN = 72 // 20mm

  useEffect(() => {
    if (contentRef.current) {
      distributeContent()
    }
    // we intentionally only recalc when children changes
  }, [children])

  const distributeContent = (): void => {
    if (!contentRef.current) return

    const newPages: Array<Page> = [{ id: 1, content: [] }]
    let currentPageIndex = 0
    let currentPageHeight = 0

    React.Children.forEach(children, (child, index) => {
      // skip falsy children like null, undefined or boolean
      if (child === null || child === undefined || child === false) return

      // Build a temporary element to measure height.
      // We try to extract textual/html content when available, otherwise
      // we fall back to string coercion for primitives.
      let childHtml = ''

      if (React.isValidElement(child)) {
        const inner = (child.props as any).children
        if (typeof inner === 'string' || typeof inner === 'number') {
          childHtml = String(inner)
        } else if (Array.isArray(inner)) {
          childHtml = inner
            .map((i) =>
              typeof i === 'string' || typeof i === 'number' ? String(i) : '',
            )
            .join('')
        } else {
          // can't reliably serialize nested React elements here — leave empty
          childHtml = ''
        }
      } else {
        // primitive child (string/number)
        if (typeof child === 'string' || typeof child === 'number')
          childHtml = String(child)
      }

      const childElement = document.createElement('div')
      childElement.style.display = 'inline-block'
      childElement.style.width = `${PAGE_WIDTH - PAGE_MARGIN * 2}px`
      childElement.style.padding = `0 ${PAGE_MARGIN}px`
      // assign the best-effort html/text
      childElement.innerHTML = childHtml

      document.body.appendChild(childElement)
      const childHeight = childElement.offsetHeight
      document.body.removeChild(childElement)

      // Check if child fits in current page
      if (currentPageHeight + childHeight > PAGE_HEIGHT - PAGE_MARGIN * 2) {
        // Create new page
        currentPageIndex++
        newPages.push({ id: currentPageIndex + 1, content: [] })
        currentPageHeight = 0
      }

      // Add child to current page — clone only if it's a React element
      if (React.isValidElement(child)) {
        // safe to cast here because of the guard above
        newPages[currentPageIndex].content.push(
          React.cloneElement(child, { key: index }),
        )
      } else {
        // primitive values (string/number) — wrap in a div so React accepts it as a node
        newPages[currentPageIndex].content.push(
          <div key={index}>{String(child as string | number)}</div>,
        )
      }

      currentPageHeight += childHeight
    })

    setPages(newPages)
  }

  return (
    <div className={`pdf-preview ${className}`} ref={contentRef}>
      {pages.map((page, index) => (
        <div
          key={page.id}
          className="pdf-page"
          style={{
            width: `${PAGE_WIDTH}px`,
            height: `${PAGE_HEIGHT}px`,
          }}
          ref={(el: HTMLDivElement | null) => {
            pageRefs.current[index] = el
          }}
        >
          <div className="page-content">{page.content}</div>
          {showPageNumbers && (
            <div className="page-number">
              Page {page.id} of {pages.length}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PDFPreview
