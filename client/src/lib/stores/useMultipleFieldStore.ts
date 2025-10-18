import { create } from 'zustand'

interface MultipleFieldStores {
  fields: Record<string, Array<any>> // dynamic sections, no typing headache
  addField: (section: string, index?: number) => void
  updateField: (
    section: string,
    index: number,
    key: string,
    value: string,
  ) => void
  deleteField: (section: string, index: number) => void
}

const useFieldStores = create<MultipleFieldStores>((set) => ({
  fields: {},

  addField: (section, index) =>
    set((state) => {
      const currentFields = state.fields[section] || []
      const newField = {}

      // clone array
      const fields = [...currentFields]

      // insert new field after index if valid
      if (typeof index === 'number' && index >= 0 && index < fields.length) {
        fields.splice(index + 1, 0, newField)
      } else {
        fields.push(newField)
      }

      return { fields: { ...state.fields, [section]: fields } }
    }),

  updateField: (section, index, key, value) =>
    set((state) => {
      const sectionFields = state.fields[section] || []
      const updatedFields = [...sectionFields]
      updatedFields[index] = { ...updatedFields[index], [key]: value }

      return { fields: { ...state.fields, [section]: updatedFields } }
    }),

  deleteField: (section, index: number) => {
    set((state) => {
      const sectionFields = state.fields[section] || []
      const updatedFields = sectionFields.filter((_, i) => i !== index)

      return { fields: { ...state.fields, [section]: updatedFields } }
    })
  },
}))
export default useFieldStores
