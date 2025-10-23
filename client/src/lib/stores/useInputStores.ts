import { create } from 'zustand'

interface InputState {
  inputValue: Record<string, string> // key value pairs for all input
  setInputValue: (name: string, value: string) => void
  setInputData: (data: Record<string, string>) => void
  reset: () => void
}
const useInputStore = create<InputState>((set) => ({
  inputValue: {},
  setInputValue: (name: string, value: string) =>
    set((state) => ({
      inputValue: { ...state.inputValue, [name]: value },
    })),
  setInputData: (data) => set({ inputValue: data }),
  reset: () => set({ inputValue: {} }),
}))

export default useInputStore
