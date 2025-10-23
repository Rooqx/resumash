import { create } from 'zustand'

interface MultipleFieldStores {
  fields: Record<string, Array<any>>
  addField: (section: string, index?: number) => void
  setFields: (data: Record<string, Array<any>>) => void
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
    experience: [],
    education: [],
    certificates: [],
    awards: [],
    skills: [],
    projects: [],
    references: [],
  },

  addField: (section, index) =>
    set((state) => {
      const currentFields = state.fields[section] || [] // fallback to empty object
      const newField = {}

      const fields = [...currentFields]
      if (typeof index === 'number' && index >= 0 && index < fields.length) {
        fields.splice(index + 1, 0, newField)
      } else {
        fields.push(newField)
      }

      return { fields: { ...state.fields, [section]: fields } }
    }),

  setFields: (data) => set({ fields: data }),
  updateField: (section, index, key, value) =>
    set((state) => {
      const sectionFields = state.fields[section] || []
      const updatedFields = [...sectionFields]
      updatedFields[index] = { ...updatedFields[index], [key]: value }

      return { fields: { ...state.fields, [section]: updatedFields } }
    }),

  deleteField: (section, index) =>
    set((state) => {
      console.log('state', state)
      console.log('index', index)

      const sectionFields = state.fields[section]
      console.log('sectionFields', sectionFields)

      // Make sure the index exists before trying to delete
      if (index < 0 || index >= sectionFields.length) {
        return state // Index out of bounds, no changes
      }

      const updatedFields = sectionFields.filter((_, i) => i !== index)
      console.log('updatedFields', updatedFields)
      return {
        fields: {
          ...state.fields,
          [section]: updatedFields,
        },
      }
    }),
}))

export default useFieldStores

// if (sectionFields.length <= 1) return state //  prevent deleting last item
