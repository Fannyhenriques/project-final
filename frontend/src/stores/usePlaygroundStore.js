// import { create } from "zustand";
// import { getUserLocation } from "../hooks/getUserLocation";

// export const usePlaygroundStore = create((set, get) => ({
//   userLocation: null,
//   playgrounds: [],
//   searchQuery: "",
//   isFetchingData: true,

//   fetchUserLocation: async () => {
//     try {
//       const location = await getUserLocation();
//       set({ userLocation: location });
//     } catch (error) {
//       console.error("Error fetching user location:", error);
//     }
//   },

//   fetchPlaygrounds: async () => {
//     try {
//       set({ isFetchingData: true });

//       // Get the userLocation from the store
//       const { lat, lng } = get().userLocation || {};  // Correctly access state with `get()`

//       // Check if lat and lng are valid
//       if (!lat || !lng) {
//         throw new Error("Invalid or missing location data.");
//       }

//       const response = await fetch(
//         `http://localhost:9000/api/playgrounds?lat=${lat}&lng=${lng}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch playgrounds.");
//       }

//       const data = await response.json();
//       set({ playgrounds: Array.isArray(data) ? data : [] });
//     } catch (error) {
//       console.error("Error fetching playgrounds:", error);
//     } finally {
//       set({ isFetchingData: false });
//     }
//   },

//   setSearchQuery: (query) => set({ searchQuery: query }),

//   searchPlaygrounds: async (address) => {
//     if (!address.trim()) return;

//     try {
//       const radius = 2000;
//       const response = await fetch(
//         `http://localhost:9000/api/playgrounds?name=${encodeURIComponent(address)}&radius=${radius}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch playgrounds.");
//       }

//       const data = await response.json();
//       set({ playgrounds: Array.isArray(data) ? data : [] });
//     } catch (error) {
//       console.error("Error searching playgrounds:", error);
//     }
//   },
// }));

