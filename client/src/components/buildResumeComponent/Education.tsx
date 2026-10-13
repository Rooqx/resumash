import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'

export default function Education() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const isEmpty = fields['education']?.length === 0
  return (
    <div className="space-y-4 mt-6">
      <span className="w-full flex justify-between items-start">
        <h3 className="text-sm font-semibold">Educations</h3>
        {isEmpty && (
          <button
            className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
            onClick={() => {
              addField('education', 0)
            }}
          >
            <span className="flex gap-2 items-center z-10">
              <Plus size={12} />
              Add Education
            </span>
          </button>
        )}
      </span>
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
              className="rs-button rs-button-outline mt-4 w-full"
              onClick={() => {
                deleteField('education', i)
              }}
            >
              <Trash  size={16} />
              <p > Delete Education</p>
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
