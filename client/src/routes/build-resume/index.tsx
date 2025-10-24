import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Document, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { ChevronLeft } from 'lucide-react'
import Sidebar from './components/SideContent'
import BasicInfoAndSummary from './components/BasicInfoAndSummary'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Education from './components/Education'
import Project from './components/Project'
import Certificate from './components/Certificate'
import Award from './components/Awards'
import App from '@/components/Layout'
// import resumeData from '@/components/resume.json'

import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import ResumeComponent from '@/resumeTemplates/template1/TSXTemplates'
import ResumePDF from '@/resumeTemplates/template1/PDFTemplate'
import { useDeviceType } from '@/lib/hooks/useDeviceHook'

export const Route = createFileRoute('/build-resume/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [displayPdf, setDisplayPdf] = useState(false)
  const { setInputData } = useInputStore()
  const { setFields } = useFieldStores()
  const { setTags } = useTagStore()
  const queryClient = useQueryClient()
  const { isDesktop } = useDeviceType()

  const resumeData: any = queryClient.getQueryData(['tailoredResume'])

  useEffect(() => {
    if (resumeData) {
      setInputData(resumeData.inputValue)
      setFields(resumeData.fields)
      setTags(resumeData.tagFields)
    }
  }, [resumeData])

  return (
    <App>
      <div className={`App  space-y-4 bg-black text-white relative`}>
        {/*  <h2 className="text-2xl font-semibold mb-2  w-full text-center">
          My Resume
        </h2> */}
        {/* ================== Wrapper  ================== */}
        <div className="w-full flex items-start justify-between h-[800px] ">
          {/* ================== Input Container  ================== */}
          <Sidebar />

          {/* ================== Resume Preview ================== */}
          <div className="flex-shrink-0 ">
            <ResumeComponent />
          </div>
          {/* ================== PDF Actions (optional) ==================*/}
          {
            <div
              className="fixed top-0 w-full h-full bg-black z-10"
              style={{
                display: displayPdf ? 'block' : 'none',
              }}
            >
              <button
                className="text-sm flex gap-3 font-medium items-center px-6 py-3 bg-white rounded-xl text-black cursor-pointer"
                onClick={() => setDisplayPdf(!displayPdf)}
              >
                <ChevronLeft size={24} /> Back
              </button>
              <PDFViewer width="100%" height="600">
                <Document>
                  <ResumePDF />
                </Document>
              </PDFViewer>
            </div>
          }

          {isDesktop && (
            <div className="h-auto space-y-5 w-[300px] ml-10 mr-10">
              <div>
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
                  {({ loading }) =>
                    loading ? 'Generating...' : 'Download PDF'
                  }
                </PDFDownloadLink>
              </div>

              {/* ==================More PDF Templates (optional) ==================*/}
              <div className="bg-[#2c5530] p-4 rounded-md mt-15">
                <h3 className="text-sm font-semibold text-white text-nowrap">
                  Other Templates
                </h3>
                <div className="py-6">
                  <button className="text-base text-white">
                    More Templates coming soon
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </App>
  )
}
