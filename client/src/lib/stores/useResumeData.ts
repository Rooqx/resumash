import { create } from 'zustand'

interface ResumeDataStore {
  resume: Record<string, any>
  setResume: (data: Record<string, any>) => void
}

const useResumeData = create<ResumeDataStore>((set) => ({
  resume: {},
  setResume: (data) => set({ resume: data }),
}))
