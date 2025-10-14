import { create } from 'zustand'
import type { Tag } from 'emblor'

interface TagsState {
  tags: Record<string, Array<Tag>>
  setTags: (key: string, tags: Array<string> | Array<Tag>) => void
  getTags: (key: string) => Array<Tag>
  resetTags: (key?: string) => void
}

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: {},

  // Convert string array to Tag array if needed
  setTags: (key, newTags) =>
    set((state) => {
      const formattedTags = Array.isArray(newTags)
        ? newTags.map((tag) =>
            typeof tag === 'string'
              ? { id: Math.random().toString(36).substr(2, 9), text: tag }
              : tag,
          )
        : []
      return {
        tags: { ...state.tags, [key]: formattedTags },
      }
    }),

  // Retrieve tags safely (return empty array if not defined)
  getTags: (key) => get().tags[key],

  // Reset one tag group or all
  resetTags: (key) =>
    set((state) => {
      if (key) {
        const updated = { ...state.tags }
        delete updated[key]
        return { tags: updated }
      }
      return { tags: {} }
    }),
}))
