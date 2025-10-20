import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'

export default function Award() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-semibold">Awards</h3>
      {(fields['awards'] || []).map((field: any, i: number) => (
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
          <Input
            type="textarea"
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
              className={`${
                i === 0
                  ? 'hidden'
                  : "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white"
              }`}
              onClick={() => {
                deleteField('awards', i)
              }}
            >
              <Trash className="hover:text-black z-1" size={16} />
              <p className="z-2 hover:text-black "> Delete Award</p>
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
