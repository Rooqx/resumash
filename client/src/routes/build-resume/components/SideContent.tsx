import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Document, PDFDownloadLink } from '@react-pdf/renderer'
import BasicInfoAndSummary from './BasicInfoAndSummary'
import Skills from './Skills'
import Experience from './Experience'
import Education from './Education'
import Project from './Project'
import Certificate from './Certificate'
import Award from './Awards'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useDeviceType } from '@/lib/hooks/useDeviceHook'
import ResumePDF from '@/resumeTemplates/template1/PDFTemplate'

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const { isDesktop } = useDeviceType()
  const [displayPdf, setDisplayPdf] = useState(false)

  const sidebarContent = (
    <div className="shadow-[2px_5px_10px_rgba(197,197,197,0.3)] w-[100vw] bg-black text-white rounded-[1px] py-2 pb-6 px-4 max-h-full overflow-y-auto mr-10 scroll-bar">
      {!isDesktop && (
        <div className="sticky top-0 bg-black z-10 py-3">
          <button
            className="py-2 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3  
                    before:content-['']  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300
                    hover:before:w-full hover:text-black border border-white"
            onClick={() => setDisplayPdf(!displayPdf)}
          >
            <p className="z-2 hover:text-black "> Preview PDF</p>
          </button>
          <PDFDownloadLink
            className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
            document={
              <Document>
                <ResumePDF />
              </Document>
            }
            fileName="Echo_Resume.pdf"
          >
            {({ loading }) => (loading ? 'Generating...' : 'Download PDF')}
          </PDFDownloadLink>
        </div>
      )}
      {/* ================== Basic Info ================== */}
      <BasicInfoAndSummary />

      {/* ================== Skills ================== */}
      <Skills />

      {/* ================== Work Experience ================== */}
      <Experience />

      {/* ================== Education ================== */}
      <Education />

      {/* ================== Projects ================== */}
      <Project />

      {/* ================== Certifications ================== */}
      <Certificate />

      {/* ================== Awards ================== */}
      <Award />
    </div>
  )

  // Mobile view → Drawer
  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="absolute top-20 text-white bg-black left-4 z-50 md:hidden"
          >
            Add Inputs
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-0">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-[80vh] left-[90vw] z-50 bg-white text-black scale-125"
            >
              ✕
            </Button>
          </DrawerClose>
          {sidebarContent}
        </DrawerContent>
      </Drawer>
    )
  }

  // Tablet/Desktop → Static sidebar
  return sidebarContent
}
