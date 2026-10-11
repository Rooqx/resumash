import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface InputState {
  inputValue: Record<string, string> // key value pairs for all input
  setInputValue: (name: string, value: string) => void
  setInputData: (data: Record<string, string>) => void
  reset: () => void
}
const useInputStore = create<InputState>()(persist((set) => ({
  inputValue: {},
  setInputValue: (name: string, value: string) =>
    set((state) => ({
      inputValue: { ...state.inputValue, [name]: value },
    })),
  setInputData: (data) => set({ inputValue: data }),
  reset: () => set({ inputValue: {} }),
}), { name: 'resumash:builder:inputs:v1', storage: createJSONStorage(() => localStorage), partialize: state => ({ inputValue: state.inputValue }) }))

export default useInputStore
