import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: "en", //Default language English
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "language-storage", //Key for localStorage
    }
  )
); 