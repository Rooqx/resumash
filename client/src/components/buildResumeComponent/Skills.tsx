import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { TagInput } from '@/components/TagInput'
import { useTagStore } from '@/lib/stores/useInputTags'

export default function Skills() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const { shiftIndexedTags } = useTagStore()
  const isEmpty = fields['skills']?.length === 0

  /** */
  return (
    <div className="space-y-4 mt-6">
      <span className="w-full flex justify-between items-start">
        <h3 className="text-sm font-semibold">Skills</h3>
        {isEmpty && (
          <button
            className={`py-2  px-4 relative overflow-hidden bg-[transparent] rounded-xs justify-center cursor-pointer
             text-white text-xs font-normal flex gap-2 items-center mb-3 before:content-[''] 
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all
              before:duration-300 hover:before:w-full hover:text-black border border-white`}
            onClick={() => {
              addField('skills', 0)
            }}
          >
            <span className="flex gap-2 items-center z-10">
              <Plus size={12} />
              Add skill
            </span>
          </button>
        )}
      </span>
      {fields['skills']?.map((field: any, i) => (
        <div key={field.id ?? i} className="border p-4 rounded-md">
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
            onChange={(t) => t}
          />{' '}
          <div className="mt-4 space-y-3">
            <button
              className="py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
              onClick={() => {
                deleteField('skills', i)
                shiftIndexedTags('skills', i, 'remove')
              }}
            >
              <Trash className="hover:text-black z-1" size={16} />
              <p className="z-2 hover:text-black "> Delete Skill</p>
            </button>{' '}
            <button
              className="py-2 px-4 bg-[var(--rs-inverse)] justify-center w-full  rounded-md cursor-pointer text-[var(--rs-inverse-text)] text-base font-medium flex gap-2 items-center"
              onClick={() => { shiftIndexedTags('skills', i, 'insert'); addField('skills', i) }}
            >
              <Plus size={16} /> Add new skill
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
