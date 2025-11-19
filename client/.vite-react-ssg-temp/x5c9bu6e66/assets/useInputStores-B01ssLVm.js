import { create } from "zustand";
const useInputStore = create((set) => ({
  inputValue: {},
  setInputValue: (name, value) => set((state) => ({
    inputValue: { ...state.inputValue, [name]: value }
  })),
  setInputData: (data) => set({ inputValue: data }),
  reset: () => set({ inputValue: {} })
}));
export {
  useInputStore as u
};
