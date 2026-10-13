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
            className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
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
            key={field.id ?? i}
            name={`skills-${i}`} // unique per field
            onChange={(t) => t}
          />{' '}
          <div className="mt-4 space-y-3">
            <button
              className="rs-button rs-button-outline mt-4 w-full"
              onClick={() => {
                deleteField('skills', i)
                shiftIndexedTags('skills', i, 'remove')
              }}
            >
              <Trash  size={16} />
              <p > Delete Skill</p>
            </button>{' '}
            <button
              className="rs-button rs-button-primary w-full"
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
