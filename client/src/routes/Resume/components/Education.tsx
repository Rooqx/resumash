import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'

export default function Education() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-semibold">Education</h3>
      {fields['education']?.map((field: any, i: number) => (
        <div key={i} className="border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="text"
              labelFor="institution"
              value={field.institution}
              onChange={(e) =>
                updateField('education', i, e.target.name, e.target.value)
              }
              inputTittle="Institution Name"
              placeholder="Enter school or university name"
            />
            <Input
              type="text"
              labelFor="studyType"
              value={field.studyType}
              onChange={(e) =>
                updateField('education', i, e.target.name, e.target.value)
              }
              inputTittle="Degree Type"
              placeholder="e.g., Bachelor's, Master's, PhD"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="text"
              labelFor="area"
              value={field.area}
              onChange={(e) =>
                updateField('education', i, e.target.name, e.target.value)
              }
              inputTittle="Field of Study"
              placeholder="e.g., Computer Science, Business Administration"
            />
            <Input
              type="text"
              labelFor="gpa"
              value={field.gpa}
              onChange={(e) =>
                updateField('education', i, e.target.name, e.target.value)
              }
              inputTittle="GPA"
              placeholder="e.g., 3.8/4.0"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="text"
              labelFor="startDate"
              value={field.startDate}
              onChange={(e) =>
                updateField('education', i, e.target.name, e.target.value)
              }
              inputTittle="Start Date"
              placeholder="MM/YYYY"
            />
            <Input
              type="text"
              labelFor="endDate"
              value={field.endDate}
              onChange={(e) =>
                updateField('education', i, e.target.name, e.target.value)
              }
              inputTittle="End Date"
              placeholder="MM/YYYY or Present"
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
                deleteField('education', i)
              }}
            >
              <Trash className="hover:text-black z-1" size={16} />
              <p className="z-2 hover:text-black "> Delete Education</p>
            </button>{' '}
            <button
              className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
              onClick={() => addField('education', i)}
            >
              <Plus size={16} /> Add New Education
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
