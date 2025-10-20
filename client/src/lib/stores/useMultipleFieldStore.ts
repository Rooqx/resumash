import { create } from 'zustand'

interface MultipleFieldStores {
  fields: Record<string, Array<any>>
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
  fields: {
    experience: [{}],
    education: [{}],
    certificates: [{}],
    awards: [{}],
    skills: [{}],
    projects: [{}],
    references: [{}],
  },

  addField: (section, index) =>
    set((state) => {
      const currentFields = state.fields[section] || [{}] // fallback to empty object
      const newField = {}

      const fields = [...currentFields]
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

  deleteField: (section, index) =>
    set((state) => {
      const sectionFields = state.fields[section] || []
      const updatedFields = sectionFields.filter((_, i) => i !== index)

      const newFields = { ...state.fields }
      if (updatedFields.length > 0) {
        newFields[section] = updatedFields
      } else {
        delete newFields[section]
      }

      return { fields: newFields }
    }),
}))

export default useFieldStores
