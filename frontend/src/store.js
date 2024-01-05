import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create(
  devtools((set, get) => ({
    selectedNameFilter: "",
    profileImageURL: "",
    setSelectedNameFilter: (name) => {
      set((state) => ({ selectedNameFilter: name }))
    },
    setProfileImageURL: (url) => set({ profileImageURL: url }),
  }))
);