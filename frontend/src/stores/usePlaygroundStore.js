import { create } from "zustand";

export const usePlaygroundStore = create((set, get) => ({
  playground: null,
  ratePlayground: async (playgroundId, rating) => {
    try {
      const response = await fetch("http://localhost:9000/api/playgrounds/rate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playgroundId, rating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit rating");
      }

      const updatedPlayground = await response.json();
      console.log("Playground rated successfully:", updatedPlayground);

      set({ playground: updatedPlayground });

    } catch (err) {
      console.error("Error rating playground:", err);
    }
  },
}));