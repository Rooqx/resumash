import { create } from 'zustand'

interface current {
  page: 'tailorPage' | 'buildPage' | 'homePage' | 'rxsmePage'
  setPage: (page: 'tailorPage' | 'buildPage' | 'homePage' | 'rxsmePage') => void
}

export const useCurrentPage = create<current>((set) => ({
  page: 'homePage',
  setPage: (page) => set({ page: page }),
}))
