import { useState } from 'react'
import { Plus, Trash, ChevronDown } from 'lucide-react'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { TagInput } from '@/components/TagInput'
import { useTagStore } from '@/lib/stores/useInputTags'

export default function Project() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const isEmpty = fields['projects']?.length === 0
  const [openNewId, setOpenNewId] = useState<string | null>(null)
  const addEntry = (index?: number) => {
    addField('projects', index)
    const current=useFieldStores.getState().fields['projects'] ?? []
    const addedIndex=index === undefined ? current.length - 1 : Math.min(index+1,current.length-1)
    setOpenNewId(current[addedIndex]?.id ?? null)
  }
  const { shiftIndexedTags } = useTagStore()
  return (
    <div className="space-y-4 mt-6">
      <span className="w-full flex justify-between items-start">
        <h3 className="text-sm font-semibold">Projects</h3>
        {isEmpty && (
          <button type="button"
            className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
            onClick={() => {
              addEntry()
            }}
          >
            <span className="flex gap-2 items-center z-10">
              <Plus size={12} />
              Add project
            </span>
          </button>
        )}
      </span>
      {fields['projects']?.map((field: any, i: number) => (
        <details key={field.id ?? i} name="resumash-projects" defaultOpen={openNewId ? openNewId === field.id : i === 0} className="group rounded-lg border" style={{borderColor:'var(--rs-line)'}}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-4 text-sm font-semibold"><span>{field.name || 'Untitled project'}</span><ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180"/></summary>
          <div className="space-y-4 p-4 pt-0">
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
          <Textarea
            labelFor="description"
            value={field.description}
            onChange={(e) =>
              updateField('projects', i, e.target.name, e.target.value)
            }
            inputTittle="Project Description"
            placeholder="Describe the project, your role, and key features"
          />
          <TagInput name={`projectHighlights-${i}`} tagTitle="Project highlights" placeholder="Enter real project contributions or achievements"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="url"
              labelFor="url"
              value={field.url}
              onChange={(e) =>
                updateField('projects', i, e.target.name, e.target.value)
              }
              inputTittle="Project URL"
              placeholder="Enter live demo or repository URL"
            />

            <TagInput
              tagTitle="Technologies Used"
              labelFor="projectTechnologies"
              key={field.id ?? i}
              name={`projectTechnologies-${i}`} // unique per field
              placeholder="List technologies used in your project"
            />
          </div>
          <div className="mt-4 space-y-3">
            <button
              className="rs-button rs-button-outline mt-4 w-full"
              onClick={() => {
                deleteField('projects', i)
                shiftIndexedTags('projectHighlights', i, 'remove')
                shiftIndexedTags('projectTechnologies', i, 'remove')
              }}
            >
              <Trash  size={16} />
              <p > Delete Project</p>
            </button>
            <button
              className="rs-button rs-button-primary w-full"
              onClick={() => { shiftIndexedTags('projectHighlights', i, 'insert'); shiftIndexedTags('projectTechnologies', i, 'insert'); addEntry(i) }}
            >
              <Plus size={16} /> Add new project
            </button>
          </div>
          </div>
        </details>
      ))}
    </div>
  )
}
