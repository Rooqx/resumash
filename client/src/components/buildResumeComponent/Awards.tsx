import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'

export default function Award() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const isEmpty = fields['awards']?.length === 0
  /* */
  return (
    <div className="space-y-4 mt-6">
      <span className="w-full flex justify-between items-start">
        <h3 className="text-sm font-semibold">Awards</h3>
        {isEmpty && (
          <button
            className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
            onClick={() => {
              addField('awards', 0)
            }}
          >
            <span className="flex gap-2 items-center z-10">
              <Plus size={12} />
              Add Award
            </span>
          </button>
        )}
      </span>
      {fields['awards'].map((field: any, i: number) => (
        <div key={i} className="border p-4 rounded-md">
          <Input
            type="text"
            labelFor="awardTitle"
            value={field.awardTitle}
            onChange={(e) =>
              updateField('awards', i, e.target.name, e.target.value)
            }
            inputTittle="Award Title"
            placeholder="Enter award name"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="text"
              labelFor="awarder"
              value={field.awarder}
              onChange={(e) =>
                updateField('awards', i, e.target.name, e.target.value)
              }
              inputTittle="Awarding Organization"
              placeholder="Organization that gave the award"
            />
            <Input
              type="text"
              labelFor="awardDate"
              value={field.awardDate}
              onChange={(e) =>
                updateField('awards', i, e.target.name, e.target.value)
              }
              inputTittle="Award Date"
              placeholder="MM/YYYY"
            />
          </div>
          <Textarea
            labelFor="awardSummary"
            value={field.awardSummary}
            onChange={(e) =>
              updateField('awards', i, e.target.name, e.target.value)
            }
            inputTittle="Award Description"
            placeholder="Describe the award and significance"
          />
          <div className="mt-4 space-y-3">
            <button
              className="rs-button rs-button-outline mt-4 w-full"
              onClick={() => {
                deleteField('awards', i)
              }}
            >
              <Trash  size={16} />
              <p > Delete Award</p>
            </button>{' '}
            <button
              className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
              onClick={() => addField('awards', i)}
            >
              <Plus size={16} /> Add new award
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
