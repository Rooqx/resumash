import { create } from 'zustand'

interface current {
  page: 'tailorPage' | 'buildPage' | 'homePage'
  setPage: (page: 'tailorPage' | 'buildPage' | 'homePage') => void
}

export const useCurrentPage = create<current>((set) => ({
  page: 'homePage',
  setPage: (page) => set({ page: page }),
}))
