import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePlaygroundStore = create(
  persist(
    (set, get) => ({
      playground: null,
      playgrounds: [],

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      setPlaygrounds: (data) => set({ playgrounds: data }),

      isMenuOpen: false,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      closeMenu: () => set({ isMenuOpen: false }),

      ratePlayground: async (playgroundId, rating) => {
        try {
          const response = await fetch(
            "http://localhost:9000/api/playgrounds/rate",
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playgroundId, rating }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to submit rating");
          }

          const updatedPlayground = await response.json();

          set({ playground: updatedPlayground });
        } catch (err) {
          console.error("Error rating playground:", err);
        }
      },
    }),
    {
      name: "playground-search-storage",
      partialize: (state) => ({ searchQuery: state.searchQuery }),
    }
  )
);