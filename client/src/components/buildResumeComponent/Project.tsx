import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { TagInput } from '@/components/TagInput'
import { useTagStore } from '@/lib/stores/useInputTags'

export default function Project() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const isEmpty = fields['projects']?.length === 0
  const { shiftIndexedTags } = useTagStore()
  return (
    <div className="space-y-4 mt-6">
      <span className="w-full flex justify-between items-start">
        <h3 className="text-sm font-semibold">Projects</h3>
        {isEmpty && (
          <button type="button"
            className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
            onClick={() => {
              addField('projects', 0)
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
        <div key={field.id ?? i} className="border p-4 rounded-md">
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
              onClick={() => { shiftIndexedTags('projectHighlights', i, 'insert'); shiftIndexedTags('projectTechnologies', i, 'insert'); addField('projects', i) }}
            >
              <Plus size={16} /> Add new project
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
