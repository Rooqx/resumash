import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { TagInput } from '@/components/TagInput'
import Textarea from '@/components/Textarea'
import { useTagStore } from '@/lib/stores/useInputTags'

export default function Experience() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const { shiftIndexedTags } = useTagStore()
  const isEmpty = fields['experience']?.length === 0
  /**  */
  return (
    <div className="space-y-4 mt-6">
      <span className="w-full flex justify-between items-start">
        <h3 className="text-sm font-semibold">Experiences</h3>
        {isEmpty && (
          <button
            className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
            onClick={() => {
              addField('experience', 0)
            }}
          >
            <span className="flex gap-2 items-center z-10">
              <Plus size={12} />
              Add Experience
            </span>
          </button>
        )}
      </span>
      {fields['experience']?.map((field: any, i: number) => (
        <div key={field.id ?? i} className="border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="text"
              labelFor="companyName"
              value={field?.companyName}
              onChange={(e) =>
                updateField('experience', i, e.target.name, e.target.value)
              }
              inputTittle="Company Name"
              placeholder="Enter company name"
            />
            <Input
              type="text"
              labelFor="jobPosition"
              value={field?.jobPosition}
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
              value={field?.jobStartDate}
              onChange={(e) =>
                updateField('experience', i, e.target.name, e.target.value)
              }
              inputTittle="Start Date"
              placeholder="MM YYYY(March 2025)"
            />
            <Input
              type="text"
              labelFor="jobEndDate"
              value={field?.jobEndDate}
              onChange={(e) =>
                updateField('experience', i, e.target.name, e.target.value)
              }
              inputTittle="End Date"
              placeholder="MM YYYY(March 2025) or Present"
            />
          </div>
          <Textarea
            labelFor="jobSummary"
            value={field?.jobSummary}
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
              className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
              onClick={() => {
                deleteField('experience', i)
                shiftIndexedTags('jobHighlights', i, 'remove')
              }}
            >
              <Trash  size={16} />
              <p > Delete Experience</p>
            </button>{' '}
            <button
              className="rs-button rs-button-primary w-full"
              onClick={() => { shiftIndexedTags('jobHighlights', i, 'insert'); addField('experience', i) }}
            >
              <Plus size={16} /> Add New Experience
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
