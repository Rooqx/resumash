import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChevronLeft, Plus, Trash } from 'lucide-react'
import { Document, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import ResumePDF from '@/resumeTemplates/template1/PDFTemplate'
import ResumeComponent from '@/resumeTemplates/template1/TSXTemplates'
import { useTagStore } from '@/lib/stores/useInputTags'
import Input from '@/components/Input'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { TagInput } from '@/components/TagInput'
import Textarea from '@/components/Textarea'

const queryClient = new QueryClient()

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [displayPdf, setDisplayPdf] = useState(true)
  const { inputValue, setInputValue } = useInputStore()
  const { fields, addField, updateField, deleteField } = useFieldStores()

  const setSuggestions = useTagStore((s) => s.setSuggestions)

  useEffect(() => {
    setSuggestions('skills', ['React', 'Vue', 'Angular', 'Next.js'])
    setSuggestions('languages', ['Harvard', 'MIT', 'Stanford', 'Yale'])
  }, [setSuggestions])

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`App  space-y-4 bg-black text-white relative`}>
        <h2 className="text-2xl font-semibold mb-2 mx-auto">My Resume</h2>
        {/* ================== Wrapper  ================== */}
        <div className="w-full flex items-start justify-between h-[800px]">
          {/* ================== Input Container  ================== */}
          <div className="shadow-[2px_5px_10px_rgba(197,197,197,0.3)] rounded-[1px] py-2 pb-6 px-6 max-h-full overflow-y-auto mr-10 scroll-bar">
            {/* ================== Basic Info ================== */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold"> Basic Info</h3>
              <div className="border p-4 rounded-md space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    labelFor="fullName"
                    value={inputValue.fullName}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="Full Name"
                    placeholder="Enter your full name"
                  />
                  <Input
                    type="text"
                    labelFor="label"
                    value={inputValue.label}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="Job Title"
                    placeholder="Enter your profession"
                  />
                </div>

                {/* ================== Contact Info ================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="email"
                    labelFor="email"
                    value={inputValue.email}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="Email"
                    placeholder="Enter your email"
                  />
                  <Input
                    type="tel"
                    labelFor="phone"
                    value={inputValue.phone}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="Phone Number"
                    placeholder="Enter your phone number"
                  />
                  <Input
                    type="text"
                    labelFor="city"
                    value={inputValue.city}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="City"
                    placeholder="Enter your city"
                  />
                  <Input
                    type="text"
                    labelFor="country"
                    value={inputValue.country}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="Country"
                    placeholder="Enter your country"
                  />
                </div>

                {/* ================== Links ================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="url"
                    labelFor="linkdlnUrl"
                    value={inputValue.linkdlnUrl}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="LinkedIn URL"
                    placeholder="Enter your LinkedIn profile URL"
                  />
                  <Input
                    type="url"
                    labelFor="githubUrl"
                    value={inputValue.githubUrl}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="GitHub URL"
                    placeholder="Enter your GitHub profile URL"
                  />
                  <Input
                    type="url"
                    labelFor="portfolioUrl"
                    value={inputValue.portfolioUrl}
                    onChange={(e) =>
                      setInputValue(e.target.name, e.target.value)
                    }
                    inputTittle="Portfolio URL"
                    placeholder="Enter your portfolio URL"
                  />
                </div>
              </div>
            </div>

            {/* ================== Summary ================== */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Summary</h3>
              <div className="border p-4 rounded-md space-y-3">
                <Textarea
                  labelFor="summary"
                  value={inputValue.summary}
                  onChange={(e) => setInputValue(e.target.name, e.target.value)}
                  inputTittle="Professional Summary"
                  placeholder="Enter your professional summary or career objective"
                />
              </div>
            </div>

            {/* ================== Skills ================== */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Skills</h3>
              {fields['skills']?.map((field: any, i) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <Input
                    type="text"
                    labelFor="skillName"
                    value={field.skillName}
                    onChange={(e) =>
                      updateField('skills', i, e.target.name, e.target.value)
                    }
                    inputTittle="Skill Category"
                    placeholder="e.g., Frontend Development, Cybersecurity, DevOps"
                  />
                  <TagInput
                    key={field.i}
                    name={`skills-${i}`} // unique per field
                    onChange={(t) => console.log(`skills-${i}:`, t)}
                  />{' '}
                  <button
                    className={`${
                      i === 0
                        ? 'hidden'
                        : "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
                    }`}
                    onClick={() => {
                      deleteField('skills', i)
                    }}
                  >
                    <Trash className="hover:text-black z-1" size={16} />
                    <p className="z-2 hover:text-black "> Delete Skill</p>
                  </button>{' '}
                  <button
                    className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
                    onClick={() => addField('skills', i)}
                  >
                    <Plus size={16} /> Add new skill
                  </button>
                </div>
              ))}
            </div>

            {/* ================== Work Experience ================== */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              {fields['experience']?.map((field: any, i: number) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      labelFor="companyName"
                      value={field.companyName}
                      onChange={(e) =>
                        updateField(
                          'experience',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Company Name"
                      placeholder="Enter company name"
                    />
                    <Input
                      type="text"
                      labelFor="jobPosition"
                      value={field.jobPosition}
                      onChange={(e) =>
                        updateField(
                          'experience',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Job Position"
                      placeholder="Enter your job title"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      labelFor="jobStartDate"
                      value={field.jobStartDate}
                      onChange={(e) =>
                        updateField(
                          'experience',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Start Date"
                      placeholder="MM YYYY(March 2025)"
                    />
                    <Input
                      type="text"
                      labelFor="jobEndDate"
                      value={field.jobEndDate}
                      onChange={(e) =>
                        updateField(
                          'experience',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="End Date"
                      placeholder="MM YYYY(March 2025) or Present"
                    />
                  </div>
                  <Textarea
                    labelFor="jobSummary"
                    value={field.jobSummary}
                    onChange={(e) =>
                      updateField(
                        'experience',
                        i,
                        e.target.name,
                        e.target.value,
                      )
                    }
                    inputTittle="Job Description"
                    placeholder="Describe your responsibilities and achievements"
                  />
                  <TagInput
                    name={`jobHighlights-${i}`}
                    tagTitle="Key Achievements"
                    placeholder="List key achievements"
                  />
                  <button
                    className={`${
                      i === 0
                        ? 'hidden'
                        : "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
                    }`}
                    onClick={() => {
                      deleteField('experience', i)
                    }}
                  >
                    <Trash className="hover:text-black z-1" size={16} />
                    <p className="z-2 hover:text-black "> Delete Experience</p>
                  </button>{' '}
                  <button
                    className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
                    onClick={() => addField('experience', i)}
                  >
                    <Plus size={16} /> Add New Experience
                  </button>
                </div>
              ))}
            </div>

            {/* ================== Education ================== */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Education</h3>
              {fields['education']?.map((field: any, i: number) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      labelFor="institution"
                      value={field.institution}
                      onChange={(e) =>
                        updateField(
                          'education',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Institution Name"
                      placeholder="Enter school or university name"
                    />
                    <Input
                      type="text"
                      labelFor="studyType"
                      value={field.studyType}
                      onChange={(e) =>
                        updateField(
                          'education',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Degree Type"
                      placeholder="e.g., Bachelor's, Master's, PhD"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      labelFor="area"
                      value={field.area}
                      onChange={(e) =>
                        updateField(
                          'education',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Field of Study"
                      placeholder="e.g., Computer Science, Business Administration"
                    />
                    <Input
                      type="text"
                      labelFor="gpa"
                      value={field.gpa}
                      onChange={(e) =>
                        updateField(
                          'education',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="GPA"
                      placeholder="e.g., 3.8/4.0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      labelFor="startDate"
                      value={field.startDate}
                      onChange={(e) =>
                        updateField(
                          'education',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Start Date"
                      placeholder="MM/YYYY"
                    />
                    <Input
                      type="text"
                      labelFor="endDate"
                      value={field.endDate}
                      onChange={(e) =>
                        updateField(
                          'education',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="End Date"
                      placeholder="MM/YYYY or Present"
                    />
                  </div>
                  <button
                    className={`${
                      i === 0
                        ? 'hidden'
                        : "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
                    }`}
                    onClick={() => {
                      deleteField('education', i)
                    }}
                  >
                    <Trash className="hover:text-black z-1" size={16} />
                    <p className="z-2 hover:text-black "> Delete Education</p>
                  </button>{' '}
                  <button
                    className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
                    onClick={() => addField('education', i)}
                  >
                    <Plus size={16} /> Add New Education
                  </button>
                </div>
              ))}
            </div>

            {/* ================== Projects ================== */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Projects</h3>
              {fields['projects']?.map((field: any, i: number) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <Input
                    type="text"
                    labelFor="name"
                    value={field.name}
                    onChange={(e) =>
                      updateField('projects', i, e.target.name, e.target.value)
                    }
                    inputTittle="Project Name"
                    placeholder="Enter project name"
                  />
                  <Input
                    type="textarea"
                    labelFor="description"
                    value={field.description}
                    onChange={(e) =>
                      updateField('projects', i, e.target.name, e.target.value)
                    }
                    inputTittle="Project Description"
                    placeholder="Describe the project, your role, and key features"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="url"
                      labelFor="url"
                      value={field.url}
                      onChange={(e) =>
                        updateField(
                          'projects',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Project URL"
                      placeholder="Enter live demo or repository URL"
                    />

                    <TagInput
                      tagTitle="Technologies Used"
                      labelFor="projectTechnologies"
                      key={field.i}
                      name={`projectTechnologies-${i}`} // unique per field
                      placeholder="List technologies used in your project"
                      onChange={(t) =>
                        console.log(`projectTechnologies-${i}:`, t)
                      }
                    />
                  </div>

                  <button
                    className={`${
                      i === 0
                        ? 'hidden'
                        : "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
                    }`}
                    onClick={() => {
                      deleteField('projects', i)
                    }}
                  >
                    <Trash size={16} /> Delete Project
                  </button>
                  <button
                    className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
                    onClick={() => addField('projects', i)}
                  >
                    <Plus size={16} /> Add new project
                  </button>
                </div>
              ))}
            </div>

            {/* ================== Certifications ================== */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Certifications</h3>
              {(fields['certificates'] || []).map((field: any, i: number) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <Input
                    type="text"
                    labelFor="certificateName"
                    value={field.certificateName}
                    onChange={(e) =>
                      updateField(
                        'certificates',
                        i,
                        e.target.name,
                        e.target.value,
                      )
                    }
                    inputTittle="Certificate Name"
                    placeholder="Enter certification name"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      labelFor="certificateIssuer"
                      value={field.certificateIssuer}
                      onChange={(e) =>
                        updateField(
                          'certificates',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Issuing Organization"
                      placeholder="e.g., Google, Microsoft, AWS"
                    />
                    <Input
                      type="text"
                      labelFor="certificateDate"
                      value={field.certificateDate}
                      onChange={(e) =>
                        updateField(
                          'certificates',
                          i,
                          e.target.name,
                          e.target.value,
                        )
                      }
                      inputTittle="Issue Date"
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <Input
                    type="url"
                    labelFor="certificateUrl"
                    value={field.certificateUrl}
                    onChange={(e) =>
                      updateField(
                        'certificates',
                        i,
                        e.target.name,
                        e.target.value,
                      )
                    }
                    inputTittle="Certificate URL"
                    placeholder="Enter verification URL"
                  />
                  <button
                    className={`${
                      i === 0
                        ? 'hidden'
                        : "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
                    }`}
                    onClick={() => {
                      deleteField('certificates', i)
                    }}
                  >
                    <Trash className="hover:text-black z-1" size={16} />
                    <p className="z-2 hover:text-black "> Delete Certificate</p>
                  </button>{' '}
                  <button
                    className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
                    onClick={() => addField('certificates', i)}
                  >
                    <Plus size={16} /> Add new certificate
                  </button>
                </div>
              ))}
            </div>

            {/* ================== Awards ================== */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Awards</h3>
              {(fields['awards'] || []).map((field: any, i: number) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <Input
                    type="text"
                    labelFor="awardTitle"
                    value={field.awardTitle}
                    onChange={(e) =>
                      updateField('awards', i, e.target.name, e.target.value)
                    }
                    inputTittle="Award Title"
                    placeholder="Enter award name"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      labelFor="awarder"
                      value={field.awarder}
                      onChange={(e) =>
                        updateField('awards', i, e.target.name, e.target.value)
                      }
                      inputTittle="Awarding Organization"
                      placeholder="Organization that gave the award"
                    />
                    <Input
                      type="text"
                      labelFor="awardDate"
                      value={field.awardDate}
                      onChange={(e) =>
                        updateField('awards', i, e.target.name, e.target.value)
                      }
                      inputTittle="Award Date"
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <Input
                    type="textarea"
                    labelFor="awardSummary"
                    value={field.awardSummary}
                    onChange={(e) =>
                      updateField('awards', i, e.target.name, e.target.value)
                    }
                    inputTittle="Award Description"
                    placeholder="Describe the award and significance"
                  />
                  <button
                    className={`${
                      i === 0
                        ? 'hidden'
                        : "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
                    }`}
                    onClick={() => {
                      deleteField('awards', i)
                    }}
                  >
                    <Trash className="hover:text-black z-1" size={16} />
                    <p className="z-2 hover:text-black "> Delete Award</p>
                  </button>{' '}
                  <button
                    className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
                    onClick={() => addField('awards', i)}
                  >
                    <Plus size={16} /> Add new award
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* ================== Resume Preview ================== */}
          <div className="">
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
                className="text-lg flex gap-3 font-medium items-center px-6 py-3 bg-white rounded-xl text-black cursor-pointer"
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
                {({ loading }) => (loading ? 'Generating...' : 'Download PDF')}
              </PDFDownloadLink>
            </div>
            {/* ==================More PDF Templates (optional) ==================*/}
            <div className="bg-[#2c5530] p-4 rounded-md mt-15">
              <h3 className="text-lg font-semibold text-white text-nowrap">
                Other Templates
              </h3>
              <div className="py-6">
                <button className="text-base text-white">
                  More Templates coming soon
                </button>
              </div>
            </div>
          </div>
        </div>{' '}
      </div>
    </QueryClientProvider>
  )
}

{
  /* ================== PDF Actions (optional) ==================
        <PDFViewer width="100%" height="600">
          <ResumePDF />
        </PDFViewer>
        <br />
        <PDFDownloadLink document={<ResumePDF />} fileName="Echo_Resume.pdf">
          {({ loading }) => (loading ? 'Generating...' : 'Download PDF')}
        </PDFDownloadLink>
        */
}
