import { create } from 'zustand'

interface MultipleFieldStores {
  fields: Array<any>
  addField: (index: number, field: string) => void
  updateField: (index: number, field: string, value: string) => void
  deleteField: (index: number) => void
}

const useFieldStores = create<MultipleFieldStores>((set) => ({
  fields: [{}], // Array<any> inferred from the type
  addField: (index, fieldType = 'default') =>
    set((state) => {
      const newField = { type: fieldType }
      const fields = [...state.fields]

      if (typeof index === 'number' && index >= 0 && index < fields.length) {
        // Insert after the given index
        fields.splice(index + 1, 0, newField)
      } else {
        // Default: append to end
        fields.push(newField)
      }

      return { fields }
    }),

  updateField: (index: number, field: string, value: string) =>
    set((state) => {
      const updatedFields = [...state.fields]
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: value,
      }
      return { fields: updatedFields }
    }),

  deleteField: (index: number) =>
    set((state) => ({
      fields: state.fields.filter((_, i) => i !== index),
    })),
}))

export default useFieldStores
