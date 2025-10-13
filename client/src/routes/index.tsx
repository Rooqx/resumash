import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import ResumePDF from '@/resumeTemplates/template1/PDFTemplate'
import ResumeComponent from '@/resumeTemplates/template1/TSXTemplates'
import Input from '@/components/Input'
import useInputStore from '@/lib/stores/useInputStores'

const queryClient = new QueryClient()
export const Route = createFileRoute('/')({
  component: RouteComponent,
})
function RouteComponent() {
  const { inputValue, setInputValue } = useInputStore()
  // const memoizeDoc = useMemo(() => <ResumeDocument value={value} />, [value])
  // console.log('inputValue', inputValue)
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h2>My Resume</h2>
        <div>
          {/** Name and job title section */}

          <Input
            type="text"
            labelFor="fullName"
            value={inputValue.test}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Full Name"
            placeholder="Enter your name"
          />
          <Input
            type="text"
            labelFor="label"
            value={inputValue.label}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Job Title"
            placeholder="Enter your profession"
          />
          {/** Contact section */}
          <Input
            type="email"
            labelFor="email"
            value={inputValue.email}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Email"
            placeholder="Enter your email"
          />
          <Input
            type="tel"
            labelFor="phone"
            value={inputValue.phone}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Phone Number"
            placeholder="Enter your phone number"
          />
          <Input
            type="text"
            labelFor="city"
            value={inputValue.city}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="city"
            placeholder="Enter your city"
          />
          <Input
            type="text"
            labelFor="country"
            value={inputValue.country}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="city"
            placeholder="Enter your country"
          />
          {/** Linkdln and gitHub url */}
          <Input
            type="url"
            labelFor="linkdlnUrl"
            value={inputValue.linkdlnUrl}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Linkdln Url"
            placeholder="Enter your Linkdln Url or Linkdln Username"
          />
          <Input
            type="url"
            labelFor="githubUrl"
            value={inputValue.githubUrl}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="GitHub Url"
            placeholder="Enter your GitHub Url or GitHub Username"
          />
          {/** Summary  section */}
          <Input
            type="text"
            labelFor="summary"
            value={inputValue.summary}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Summary"
            placeholder="Enter your summary or objective if any"
          />

          {/** Work Experience section */}
          <Input
            type="text"
            labelFor="companyName"
            value={inputValue.companyName}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Company Name"
            placeholder="Enter company name"
          />
          <Input
            type="text"
            labelFor="jobPosition"
            value={inputValue.jobPosition}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Job Position/Role"
            placeholder="Enter Job Position/Role at company"
          />
        </div>
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
