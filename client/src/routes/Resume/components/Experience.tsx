import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { TagInput } from '@/components/TagInput'
import Textarea from '@/components/Textarea'

export default function Experience() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-semibold">Work Experience</h3>
      {fields['experience']?.map((field: any, i: number) => (
        <div key={i} className="border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="text"
              labelFor="companyName"
              value={field.companyName}
              onChange={(e) =>
                updateField('experience', i, e.target.name, e.target.value)
              }
              inputTittle="Company Name"
              placeholder="Enter company name"
            />
            <Input
              type="text"
              labelFor="jobPosition"
              value={field.jobPosition}
              onChange={(e) =>
                updateField('experience', i, e.target.name, e.target.value)
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
                updateField('experience', i, e.target.name, e.target.value)
              }
              inputTittle="Start Date"
              placeholder="MM YYYY(March 2025)"
            />
            <Input
              type="text"
              labelFor="jobEndDate"
              value={field.jobEndDate}
              onChange={(e) =>
                updateField('experience', i, e.target.name, e.target.value)
              }
              inputTittle="End Date"
              placeholder="MM YYYY(March 2025) or Present"
            />
          </div>
          <Textarea
            labelFor="jobSummary"
            value={field.jobSummary}
            onChange={(e) =>
              updateField('experience', i, e.target.name, e.target.value)
            }
            inputTittle="Job Description"
            placeholder="Describe your responsibilities and achievements"
          />
          <TagInput
            name={`jobHighlights-${i}`}
            tagTitle="Key Achievements"
            placeholder="List key achievements"
          />
          <div className="mt-4 space-y-3">
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
        </div>
      ))}
    </div>
  )
}
