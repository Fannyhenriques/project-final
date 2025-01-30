import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      register: async (name, email, password) => {
        try {
          const response = await fetch("https://project-playground-api.onrender.com/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await response.json();

          // Log the response data for debugging
          console.log("API Response:", data);

          // Improved error handling for registration
          if (!response.ok) {
            throw new Error(`Registration failed: ${data.message || 'Unknown error'}`);
          }
          if (data.userId && data.accessToken) {
            // Constructing the user object
            const user = {
              id: data.userId,
              email,
              savedPlaygrounds: [],
              accessToken: data.accessToken,
              name,
            };

            // Store the user in localStorage
            localStorage.setItem("user", JSON.stringify(user));
            console.log("User registered and saved to localStorage:", user);

            set({ user, isLoggedIn: true });
            // Optionally, fetch the complete user profile after registration to populate additional fields
            // Example: fetchUserProfile();

          } else {
            console.error("User data not found in API response (missing userId or accessToken)");
          }
        } catch (err) {
          console.error("Registration failed:", err);
        }
      },
      login: async (email, password) => {
        try {
          const response = await fetch("https://project-playground-api.onrender.com/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          console.log("Login response data:", data);  // Log the response for debugging

          if (!response.ok) {
            throw new Error(`Login failed: ${data.message || 'Unknown error'}`);
          }

          // Ensure userData matches the expected User type
          const userData = {
            id: data.userId,
            name: data.name,
            email: data.email,
            savedPlaygrounds: data.savedPlaygrounds || [],
            accessToken: data.accessToken,
          };

          localStorage.setItem("user", JSON.stringify(userData));  // Store as a JSON string
          console.log("Stored user in localStorage:", userData);

          // Update state or store with the user data
          set({ user: userData, isLoggedIn: true });

        } catch (err) {
          console.error("Login failed:", err);
        }
      },
      fetchUserProfile: async () => {
        const storedUser = localStorage.getItem("user");
        console.log("Stored User: ", storedUser);

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            console.log("Parsed User: ", user);

            if (user && user.accessToken) {
              const response = await fetch("https://project-playground-api.onrender.com/user/profile", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `${user.accessToken}`,
                },
              });

              if (response.ok) {
                const profileData = await response.json();
                console.log("Fetched Profile Data:", profileData);

                // This retrieves the name which is nested in the user. 
                set({ user: { ...user, name: profileData.user?.name }, isLoggedIn: true });
              } else {
                console.error("Failed to fetch profile:", response.statusText);
              }
            }
          } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
          }
        }
      },
      postPlayground: async (playgroundData) => {
        try {
          const user = get().user;
          if (!user) throw new Error("User not logged in");

          const response = await fetch("https://project-playground-api.onrender.com/api/playgrounds", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${user.accessToken}`,
            },
            body: JSON.stringify(playgroundData),
          });

          // Read response only once
          const data = await response.json();
          console.log("API Response Data:", data);

          if (!response.ok) throw new Error(data.message || "Failed to post playground");

          // Update user in the store with the new playground
          set((state) => {
            const updatedUser = {
              ...state.user,
              savedPlaygrounds: [
                ...state.user.savedPlaygrounds,
                ...data.playground ? [data.playground] : []
              ],
            };
            console.log("Updated savedPlaygrounds:", updatedUser.savedPlaygrounds);
            return { user: updatedUser };
          });

          console.log("Playground added:", data.playground);
        } catch (err) {
          console.error("Error posting playground:", err);
        }
      },


      removePlayground: async (playgroundToRemove) => {
        try {
          const response = await fetch(`https://project-playground-api.onrender.com/playgrounds/${playgroundToRemove.id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to remove playground");
          }

          // Update the state to remove the playground from savedPlaygrounds
          set((state) => ({
            user: {
              ...state.user,
              savedPlaygrounds: state.user.savedPlaygrounds.filter(
                (pg) => pg.id !== playgroundToRemove.id
              ),
            },
          }));

          console.log("Playground removed successfully:", playgroundToRemove);
        } catch (err) {
          console.error("Error removing playground:", err);
        }
      },
      logout: () => {
        try {
          set({ user: null, isLoggedIn: false });
          localStorage.removeItem("user"); // Remove user from localStorage
        } catch (err) {
          console.error("An error occurred while logging out:", err);
        }
      },
    }),
    {
      name: "user-store", // Key for persistence
      partialize: (state) => ({
        user: state.user, // Only persist the user data
      }),
    }
  )
);