// src/stores/useTagStore.ts
import { create } from 'zustand'

type TagFieldData = {
  tags: Array<string>
  input: string
  suggestions: Array<string>
}

type TagStore = {
  fields: Record<string, TagFieldData>
  setInput: (name: string, value: string) => void
  addTag: (name: string, tag: string) => void
  addTags: (name: string, tags: Array<string>) => void
  removeTag: (name: string, tag: string) => void
  clearTags: (name: string) => void
  setSuggestions: (name: string, suggestions: Array<string>) => void
  getTags: (name: string) => Array<string>
  removeField: (name: string) => void
}

export const useTagStore = create<TagStore>((set, get) => ({
  fields: {},

  // ✅ Initialize if missing before setting input
  setInput: (name, value) =>
    set((state) => {
      const current = state.fields[name] || {
        tags: [],
        input: '',
        suggestions: [],
      }
      return {
        fields: {
          ...state.fields,
          [name]: { ...current, input: value },
        },
      }
    }),

  // ✅ Initialize if missing before adding tag
  addTag: (name, tag) =>
    set((state) => {
      const current = state.fields[name] || {
        tags: [],
        input: '',
        suggestions: [],
      }
      const clean = tag.trim()
      if (!clean || current.tags.includes(clean)) return state

      return {
        fields: {
          ...state.fields,
          [name]: { ...current, tags: [...current.tags, clean], input: '' },
        },
      }
    }),

  // ✅ Initialize if missing before removing tag
  removeTag: (name, tag) =>
    set((state) => {
      const current = state.fields[name] || {
        tags: [],
        input: '',
        suggestions: [],
      }
      return {
        fields: {
          ...state.fields,
          [name]: { ...current, tags: current.tags.filter((t) => t !== tag) },
        },
      }
    }),

  clearTags: (name) =>
    set((state) => ({
      fields: {
        ...state.fields,
        [name]: { tags: [], input: '', suggestions: [] },
      },
    })),

  setSuggestions: (name, suggestions) =>
    set((state) => {
      const current = state.fields[name] || {
        tags: [],
        input: '',
        suggestions: [],
      }
      return {
        fields: {
          ...state.fields,
          [name]: { ...current, suggestions },
        },
      }
    }),

  addTags: (name, tags) =>
    set((state) => {
      const current = state.fields[name] || {
        tags: [],
        input: '',
        suggestions: [],
      }
      const cleanTags = tags
        .map((tag) => tag.trim())
        .filter((tag) => tag && !current.tags.includes(tag))

      return {
        fields: {
          ...state.fields,
          [name]: {
            ...current,
            tags: [...current.tags, ...cleanTags],
            input: '',
          },
        },
      }
    }),

  getTags: (name) => get().fields[name]?.tags || [],
  removeField: (name: string) =>
    set((state) => {
      const { [name]: _, ...rest } = state.fields
      return { fields: rest }
    }),
}))
