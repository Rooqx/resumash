import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { TagInput } from '@/components/TagInput'

export default function Project() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-semibold">Projects</h3>
      {fields['projects']?.map((field: any, i: number) => (
        <div key={i} className="border p-4 rounded-md">
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
              onChange={(t) => console.log(`projectTechnologies-${i}:`, t)}
            />
          </div>
          <div className="mt-4 space-y-3">
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
        </div>
      ))}
    </div>
  )
}
