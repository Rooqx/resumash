import { create } from 'zustand'

interface MultipleFieldStores {
  fields: Array<any>
  addField: () => void
  updateField: (index: number, field: string, value: string) => void
  deleteField: (index: number) => void
}

const useFieldStores = create<MultipleFieldStores>((set) => ({
  fields: [{}], // Array<any> inferred from the type
  addField: () =>
    set((state) => ({
      fields: [...state.fields, {}],
    })),

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
