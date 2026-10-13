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
          <button
            className={`py-2  px-4 relative overflow-hidden bg-[transparent] rounded-xs justify-center cursor-pointer
             text-white text-xs font-normal flex gap-2 items-center mb-3 before:content-[''] 
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all
              before:duration-300 hover:before:w-full hover:text-black border border-white`}
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
              key={field.i}
              name={`projectTechnologies-${i}`} // unique per field
              placeholder="List technologies used in your project"
              onChange={(t) => t}
            />
          </div>
          <div className="mt-4 space-y-3">
            <button
              className="py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
              onClick={() => {
                deleteField('projects', i)
                shiftIndexedTags('projectTechnologies', i, 'remove')
              }}
            >
              <Trash className="hover:text-black z-1" size={16} />
              <p className="z-2 hover:text-black "> Delete Project</p>
            </button>
            <button
              className="py-2 px-4 bg-[var(--rs-inverse)] justify-center w-full  rounded-md cursor-pointer text-[var(--rs-inverse-text)] text-base font-medium flex gap-2 items-center"
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
