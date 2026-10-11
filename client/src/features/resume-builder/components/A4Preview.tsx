import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Minus, Plus, Scan } from 'lucide-react'

const PAGE_WIDTH = 794
const PAGE_HEIGHT = 1122

/**
 * Browser preview retains actual A4 CSS coordinates. Scaling the whole page,
 * not just the font, preserves line wrapping and relative margins on mobile.
 * Fit is calculated against the actual container using ResizeObserver.
 */
export default function A4Preview({ children, label = 'Resume preview' }: {
  children: ReactNode
  label?: string
}) {
  const container = useRef<HTMLDivElement>(null)
  const [availableWidth, setAvailableWidth] = useState(PAGE_WIDTH)
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const node = container.current
    if (!node) return
    const measure = () => setAvailableWidth(Math.max(180, node.clientWidth - 20))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const fit = Math.min(1, availableWidth / PAGE_WIDTH)
  const scale = fit * zoom
  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs" style={{color:'var(--rs-muted)'}}>A4 · {Math.round(scale * 100)}%</span>
        <div className="flex items-center gap-1">
          <button type="button" className="rs-button rs-button-outline !min-h-8 !p-2"
            aria-label="Zoom out" disabled={zoom<=0.6} onClick={()=>setZoom(z=>Math.max(.6,Math.round((z-.2)*10)/10))}><Minus size={14}/></button>
          <button type="button" className="rs-button rs-button-outline !min-h-8 !px-3 text-xs"
            onClick={()=>setZoom(1)} aria-label="Fit A4 to available width"><Scan size={13}/> Fit</button>
          <button type="button" className="rs-button rs-button-outline !min-h-8 !p-2"
            aria-label="Zoom in" disabled={zoom>=3} onClick={()=>setZoom(z=>Math.min(3,Math.round((z+.2)*10)/10))}><Plus size={14}/></button>
        </div>
      </div>
      <div ref={container} aria-label={label} className="w-full max-h-[830px] overflow-auto rounded-lg bg-[#dddddd] p-2">
        <div className="relative mx-auto" style={{width:PAGE_WIDTH*scale,height:PAGE_HEIGHT*scale,marginLeft:scale>fit?'auto':undefined}}>
          <div style={{width:PAGE_WIDTH,height:PAGE_HEIGHT,transform:`scale(${scale})`,transformOrigin:'top left'}}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
