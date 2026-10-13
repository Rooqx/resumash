import { useState } from 'react'
import { Plus, Trash, ChevronDown } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { TagInput } from '@/components/TagInput'
import Textarea from '@/components/Textarea'
import { useTagStore } from '@/lib/stores/useInputTags'

export default function Experience() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const { shiftIndexedTags } = useTagStore()
  const isEmpty = fields['experience']?.length === 0
  const [openNewId, setOpenNewId] = useState<string | null>(null)
  const addEntry = (index?: number) => {
    addField('experience', index)
    const current=useFieldStores.getState().fields['experience'] ?? []
    const addedIndex=index === undefined ? current.length - 1 : Math.min(index+1,current.length-1)
    setOpenNewId(current[addedIndex]?.id ?? null)
  }
  /**  */
  return (
    <div className="space-y-4 mt-6">
      <span className="w-full flex justify-between items-start">
        <h3 className="text-sm font-semibold">Experiences</h3>
        {isEmpty && (
          <button
            className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
            onClick={() => {
              addEntry()
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
        <details key={field.id ?? i} open={openNewId === null ? i === 0 : openNewId === String(field.id ?? i)}
          onToggle={event => {
            const id=String(field.id ?? i)
            const opened=event.currentTarget.open
            setOpenNewId(current=>opened ? id : current===id ? '' : current)
          }} className="group rounded-lg border" style={{borderColor:'var(--rs-line)'}}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-4 text-sm font-semibold"><span>{field.jobPosition || field.companyName || 'Untitled experience'}</span><ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180"/></summary>
          <div className="space-y-4 p-4 pt-0">
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
              onClick={() => { shiftIndexedTags('jobHighlights', i, 'insert'); addEntry(i) }}
            >
              <Plus size={16} /> Add New Experience
            </button>
          </div>
          </div>
        </details>
      ))}
    </div>
  )
}
