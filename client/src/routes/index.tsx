import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Plus, Trash } from 'lucide-react'
import { TagInput, type Tag } from 'emblor'
import ResumePDF from '@/resumeTemplates/template1/PDFTemplate'
import ResumeComponent from '@/resumeTemplates/template1/TSXTemplates'
import { useTagsStore } from '@/lib/stores/useInputTags'
import Input from '@/components/Input'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'

const queryClient = new QueryClient()

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { inputValue, setInputValue } = useInputStore()
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const [activeTagIndex, setActiveTagIndex] = useState<number>(-1)
  console.log(fields)
  const { tags, setTags } = useTagsStore()
  //  const tags = getTags(category)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-2">My Resume</h2>

        {/* ================== Basic Info ================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            labelFor="fullName"
            value={inputValue.fullName}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Full Name"
            placeholder="Enter your full name"
          />
          <Input
            type="text"
            labelFor="label"
            value={inputValue.label}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
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
            inputTittle="City"
            placeholder="Enter your city"
          />
          <Input
            type="text"
            labelFor="country"
            value={inputValue.country}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
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
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="LinkedIn URL"
            placeholder="Enter your LinkedIn profile URL"
          />
          <Input
            type="url"
            labelFor="githubUrl"
            value={inputValue.githubUrl}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="GitHub URL"
            placeholder="Enter your GitHub profile URL"
          />
          <Input
            type="url"
            labelFor="portfolioUrl"
            value={inputValue.portfolioUrl}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Portfolio URL"
            placeholder="Enter your portfolio URL"
          />
        </div>

        {/* ================== Summary ================== */}
        <Input
          type="textarea"
          labelFor="summary"
          value={inputValue.summary}
          onChange={(e) => setInputValue(e.target.name, e.target.value)}
          inputTittle="Professional Summary"
          placeholder="Enter your professional summary or career objective"
        />

        {/* ================== Work Experience ================== */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Work Experience</h3>
          {fields.map((field, i) => (
            <div key={i} className="border p-4 rounded-md space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="text"
                  labelFor="companyName"
                  value={field.companyName}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Company Name"
                  placeholder="Enter company name"
                />
                <Input
                  type="text"
                  labelFor="jobPosition"
                  value={field.jobPosition}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Job Position"
                  placeholder="Enter your job title"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="text"
                  labelFor="startDate"
                  value={field.startDate}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Start Date"
                  placeholder="MM/YYYY"
                />
                <Input
                  type="text"
                  labelFor="endDate"
                  value={field.endDate}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="End Date"
                  placeholder="MM/YYYY or Present"
                />
              </div>
              <Input
                type="textarea"
                labelFor="summary"
                value={field.summary}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Job Description"
                placeholder="Describe your responsibilities and achievements"
              />
              <Input
                type="text"
                labelFor="highlights"
                value={field.highlights}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Key Achievements"
                placeholder="List key achievements separated by commas"
              />

              <button
                className="mt-2 py-2 px-4 bg-red-500 rounded-md text-white text-sm flex gap-2 items-center"
                onClick={() => deleteField(i)}
              >
                <Trash size={16} /> Delete Experience
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 bg-purple-500 rounded-md text-white text-sm font-medium flex gap-2 items-center"
            onClick={() => addField()}
          >
            <Plus size={16} /> Add New Experience
          </button>
        </div>

        {/* ================== Education ================== */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Education</h3>
          {fields.map((field, i) => (
            <div key={i} className="border p-4 rounded-md space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="text"
                  labelFor="institution"
                  value={field.institution}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Institution Name"
                  placeholder="Enter school or university name"
                />
                <Input
                  type="text"
                  labelFor="studyType"
                  value={field.studyType}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
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
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Field of Study"
                  placeholder="e.g., Computer Science, Business Administration"
                />
                <Input
                  type="text"
                  labelFor="gpa"
                  value={field.gpa}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
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
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Start Date"
                  placeholder="MM/YYYY"
                />
                <Input
                  type="text"
                  labelFor="endDate"
                  value={field.endDate}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="End Date"
                  placeholder="MM/YYYY or Present"
                />
              </div>

              <button
                className="mt-2 py-2 px-4 bg-red-500 rounded-md text-white text-sm flex gap-2 items-center"
                onClick={() => deleteField(i)}
              >
                <Trash size={16} /> Delete Education
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 bg-purple-500 rounded-md text-white text-sm font-medium flex gap-2 items-center"
            onClick={() => addField()}
          >
            <Plus size={16} /> Add Education
          </button>
        </div>

        {/* ================== Skills ================== */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Skills</h3>
          {fields.map((field, i) => (
            <div key={i} className="border p-4 rounded-md space-y-3">
              <Input
                type="text"
                labelFor="skillName"
                value={field.skillName}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Skill Category"
                placeholder="e.g., Frontend Development, Cybersecurity, DevOps"
              />

              <button
                className="mt-2 py-2 px-4 bg-red-500 rounded-md text-white text-sm flex gap-2 items-center"
                onClick={() => deleteField(i)}
              >
                <Trash size={16} /> Delete Skill
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 bg-purple-500 rounded-md text-white text-sm font-medium flex gap-2 items-center"
            onClick={() => addField()}
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>

        {/* ================== Projects ================== */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Projects</h3>
          {fields.map((field, i) => (
            <div key={i} className="border p-4 rounded-md space-y-3">
              <Input
                type="text"
                labelFor="projectName"
                value={field.projectName}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Project Name"
                placeholder="Enter project name"
              />
              <Input
                type="textarea"
                labelFor="projectDescription"
                value={field.projectDescription}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Project Description"
                placeholder="Describe the project, your role, and key features"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="url"
                  labelFor="projectUrl"
                  value={field.projectUrl}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Project URL"
                  placeholder="Enter live demo or repository URL"
                />
                <Input
                  type="text"
                  labelFor="projectTechnologies"
                  value={field.projectTechnologies}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Technologies Used"
                  placeholder="List technologies separated by commas"
                />
              </div>

              <button
                className="mt-2 py-2 px-4 bg-red-500 rounded-md text-white text-sm flex gap-2 items-center"
                onClick={() => deleteField(i)}
              >
                <Trash size={16} /> Delete Project
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 bg-purple-500 rounded-md text-white text-sm font-medium flex gap-2 items-center"
            onClick={() => addField()}
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* ================== Certifications ================== */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Certifications</h3>
          {fields.map((field, i) => (
            <div key={i} className="border p-4 rounded-md space-y-3">
              <Input
                type="text"
                labelFor="certificateName"
                value={field.certificateName}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Certificate Name"
                placeholder="Enter certification name"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="text"
                  labelFor="certificateIssuer"
                  value={field.certificateIssuer}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Issuing Organization"
                  placeholder="e.g., Google, Microsoft, AWS"
                />
                <Input
                  type="text"
                  labelFor="certificateDate"
                  value={field.certificateDate}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Issue Date"
                  placeholder="MM/YYYY"
                />
              </div>
              <Input
                type="url"
                labelFor="certificateUrl"
                value={field.certificateUrl}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Certificate URL"
                placeholder="Enter verification URL"
              />

              <button
                className="mt-2 py-2 px-4 bg-red-500 rounded-md text-white text-sm flex gap-2 items-center"
                onClick={() => deleteField(i)}
              >
                <Trash size={16} /> Delete Certificate
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 bg-purple-500 rounded-md text-white text-sm font-medium flex gap-2 items-center"
            onClick={() => addField()}
          >
            <Plus size={16} /> Add Certificate
          </button>
        </div>

        {/* ================== Awards ================== */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Awards</h3>
          {fields.map((field, i) => (
            <div key={i} className="border p-4 rounded-md space-y-3">
              <Input
                type="text"
                labelFor="awardTitle"
                value={field.awardTitle}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Award Title"
                placeholder="Enter award name"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="text"
                  labelFor="awarder"
                  value={field.awarder}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Awarding Organization"
                  placeholder="Organization that gave the award"
                />
                <Input
                  type="text"
                  labelFor="awardDate"
                  value={field.awardDate}
                  onChange={(e) =>
                    updateField(i, e.target.name, e.target.value)
                  }
                  inputTittle="Award Date"
                  placeholder="MM/YYYY"
                />
              </div>
              <Input
                type="textarea"
                labelFor="awardSummary"
                value={field.awardSummary}
                onChange={(e) => updateField(i, e.target.name, e.target.value)}
                inputTittle="Award Description"
                placeholder="Describe the award and significance"
              />

              <button
                className="mt-2 py-2 px-4 bg-red-500 rounded-md text-white text-sm flex gap-2 items-center"
                onClick={() => deleteField(i)}
              >
                <Trash size={16} /> Delete Award
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 bg-purple-500 rounded-md text-white text-sm font-medium flex gap-2 items-center"
            onClick={() => addField()}
          >
            <Plus size={16} /> Add Award
          </button>
        </div>

        {/* ================== Resume Preview ================== */}
        <div className="w-full flex justify-center items-center mt-8">
          <ResumeComponent />
        </div>
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
