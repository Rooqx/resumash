import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Sidebar from '../../components/buildResumeComponent/SideContent'
import App from '@/components/Layout'
// import resumeData from '@/components/resume.json'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import ResumePDF from '@/resumeTemplates/template1/PDFTemplate'
import { useDeviceType } from '@/lib/hooks/useDeviceHook'
import { useCurrentPage } from '@/lib/stores/useCurrentPage'
import SEO from '@/components/SEO'
import { downloadResume } from '@/lib/serverActions/downloadPDF'
import { PDFPreview } from '@/components/PdfUtils'
// import { PdfPage, PdfPreviewArea } from '@/components/PdfUtils'

export const Route = createFileRoute('/build-resume/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { inputValue, setInputData } = useInputStore()
  const { setFields } = useFieldStores()
  const { setTags } = useTagStore()
  const queryClient = useQueryClient()
  const { isDesktop } = useDeviceType()
  const { page, setPage } = useCurrentPage()

  const resumeData: any = queryClient.getQueryData(['tailoredResume'])

  useEffect(() => {
    if (resumeData) {
      setInputData(resumeData.inputValue)
      setFields(resumeData.fields)
      setTags(resumeData.tagFields)
    }
  }, [resumeData])

  useEffect(() => {
    setPage('buildPage')
  }, [page, setPage])

  const fileName = inputValue?.fullName
    ? `${inputValue.fullName.split(' ').join('_')}_resume.pdf`
    : 'resume.pdf'
  return (
    <App>
      <SEO
        title="Build Resume"
        description="Build your professional resume easily."
      />
      <div className={`  space-y-4 bg-black text-white relative min-h-screen`}>
        {/*  <h2 className="text-2xl font-semibold mb-2  w-full text-center">
          My Resume
        </h2> */}
        {/* ================== Wrapper  ================== */}
        <div className="w-full flex items-start gap-0 justify-center h-full">
          {/* ================== Input Container  ================== */}
          <Sidebar />

          {/* ================== Resume Preview ================== */}
          {/* PDF Preview Section */}
          <div className="w-[60%] h-[850px] overflow-auto p-2 scroll-bar">
            <div className="scale-y-85 scale-x-85 -mt-20">
              <PDFPreview showPageNumbers={true}>
                <ResumePDF />
              </PDFPreview>
            </div>
          </div>
          {/* ================== PDF Actions (optional) ==================*/}

          {isDesktop && (
            <div className="h-auto space-y-5 p-5 w-[20%]">
              <div>
                <button
                  className="py-2 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3  
              before:content-['']  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300
              hover:before:w-full hover:text-black border border-white"
                  onClick={() => downloadResume(fileName)}
                >
                  <p className="z-2 hover:text-black "> Download resume</p>
                </button>

                {/* <div
                  className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
                  document={
                    <Document>
                      <ResumePDF />
                    </Document>
                  }
                  fileName={
                    inputValue?.fullName
                      ? `${inputValue.fullName.split(' ').join('_')}_resume.pdf`
                      : 'resume.pdf'
                  }
                >
                  {({ loading }) =>
                    loading ? 'Generating...' : 'Download resume'
                  }
                </div>*/}
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
