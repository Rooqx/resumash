import { Plus, Trash } from 'lucide-react'
import Input from '@/components/Input'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'

export default function Certificate() {
  const { fields, addField, updateField, deleteField } = useFieldStores()
  const isEmpty = fields['certificates']?.length > 0
  return (
    <div className="space-y-4 mt-6">
      <span className="w-full flex justify-between items-start">
        <h3 className="text-sm font-semibold">Certifications</h3>
        {!isEmpty && (
          <button
            className="rs-button rs-button-outline !min-h-10 !px-3 text-xs"
            onClick={() => {
              addField('certificates', 0)
            }}
          >
            <span className="flex gap-2 items-center z-10">
              <Plus size={12} />
              Add Certificate
            </span>
          </button>
        )}
      </span>
      {isEmpty &&
        fields['certificates'].map((field: any, i: number) => (
          <div key={i} className="border p-4 rounded-md">
            <Input
              type="text"
              labelFor="certificateName"
              value={field.certificateName}
              onChange={(e) =>
                updateField('certificates', i, e.target.name, e.target.value)
              }
              inputTittle="Certificate Name"
              placeholder="Enter certification name"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                type="text"
                labelFor="certificateIssuer"
                value={field.certificateIssuer}
                onChange={(e) =>
                  updateField('certificates', i, e.target.name, e.target.value)
                }
                inputTittle="Issuing Organization"
                placeholder="e.g., Google, Microsoft, AWS"
              />
              <Input
                type="text"
                labelFor="certificateDate"
                value={field.certificateDate}
                onChange={(e) =>
                  updateField('certificates', i, e.target.name, e.target.value)
                }
                inputTittle="Issue Date"
                placeholder="MM/YYYY"
              />
            </div>
            <Input
              type="url"
              labelFor="certificateUrl"
              value={field.certificateUrl}
              onChange={(e) =>
                updateField('certificates', i, e.target.name, e.target.value)
              }
              inputTittle="Certificate URL"
              placeholder="Enter verification URL"
            />
            <div className="mt-4 space-y-3">
              <button
                className="rs-button rs-button-outline mt-4 w-full"
                onClick={() => {
                  deleteField('certificates', i)
                }}
              >
                <Trash  size={16} />
                <p > Delete Certificate</p>
              </button>{' '}
              <button
                className="py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center"
                onClick={() => addField('certificates', i)}
              >
                <Plus size={16} /> Add new certificate
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}
