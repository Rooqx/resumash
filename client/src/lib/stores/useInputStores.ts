import { create } from 'zustand'

interface InputState {
  inputValue: Record<string, string> // key value pairs for all input
  setInputValue: (name: string, value: string) => void
  reset: () => void
}
const useInputStore = create<InputState>((set) => ({
  inputValue: {},
  setInputValue: (name: string, value: string) =>
    set((state) => ({
      inputValue: { ...state.inputValue, [name]: value },
    })),
  reset: () => set({ inputValue: {} }),
}))

export default useInputStore
