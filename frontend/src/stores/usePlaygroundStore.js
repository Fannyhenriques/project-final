import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePlaygroundStore = create(
  persist(
    (set, get) => ({
      playground: null,
      playgrounds: [], // New state to store the list of playgrounds

      // Search Query (Persisted)
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Set playgrounds
      setPlaygrounds: (data) => set({ playgrounds: data }),

      // Menu State
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
      name: "playground-search-storage", // Storage key
      partialize: (state) => ({ searchQuery: state.searchQuery }), // Only persist searchQuery
    }
  )
);
