import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import ResumePDF from '@/resumeTemplates/template1/PDFTemplate'
import ResumeComponent from '@/resumeTemplates/template1/TSXTemplates'

const queryClient = new QueryClient()
export const Route = createFileRoute('/')({
  component: RouteComponent,
})
function RouteComponent() {
  const [value, setValue] = useState('Full name')
  // const memoizeDoc = useMemo(() => <ResumeDocument value={value} />, [value])
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h2>My Resume</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="text-2xl"
        />
        <div className="w-full flex justify-center items-center">
          <ResumeComponent />
        </div>
        {/*  <PDFViewer width="100%" height="600">
          <ResumePDF />
        </PDFViewer>

        <br />

        <PDFDownloadLink document={<ResumePDF />} fileName="Echo_Resume.pdf">
          {({ loading }) => (loading ? 'Generating...' : 'Download PDF')}
        </PDFDownloadLink>*/}
      </div>
    </QueryClientProvider>
  )
}
