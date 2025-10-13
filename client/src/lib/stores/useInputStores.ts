import { create } from 'zustand'

interface InputState {
  inputValues: Record<string, string> // key value pairs for all input
  setInputValues: (ame: string, value: string) => void
  reset: () => void
}
const useInputStore = create<InputState>((set) => ({
  inputValues: {},
  setInputValues: (name: string, value: string) =>
    set((state) => ({
      inputValues: { ...state.inputValues, [name]: value },
    })),
  reset: () => set({ inputValues: {} }),
}))

export default useInputStore
