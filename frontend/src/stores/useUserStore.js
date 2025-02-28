import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      register: async (name, email, password) => {
        try {
          const response = await fetch(
            "https://project-playgroundfinder-api.onrender.com/user/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password }),
            }
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              `Registration failed: ${data.message || "Unknown error"}`
            );
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

            localStorage.setItem("user", JSON.stringify(user));
            set({ user, isLoggedIn: true });
          } else {
            console.error(
              "User data not found in API response (missing userId or accessToken)"
            );
          }
        } catch (err) {
          console.error("Registration failed:", err);
        }
      },
      login: async (email, password) => {
        try {
          const response = await fetch(
            "https://project-playgroundfinder-api.onrender.com/user/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(`Login failed: ${data.message || "Unknown error"}`);
          }

          const userData = {
            id: data.userId,
            name: data.name,
            email: data.email,
            accessToken: data.accessToken,
          };

          const savedPlaygrounds = JSON.parse(
            localStorage.getItem("savedPlaygrounds") || "[]"
          );
          userData.savedPlaygrounds = savedPlaygrounds;
          localStorage.setItem("user", JSON.stringify(userData));

          set({ user: userData, isLoggedIn: true });
        } catch (err) {
          console.error("Login failed:", err);
        }
      },

      fetchUserProfile: async () => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            if (user && user.accessToken) {
              const response = await fetch(
                "https://project-playgroundfinder-api.onrender.com/user/profile",
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `${user.accessToken}`,
                  },
                }
              );

              if (response.ok) {
                const profileData = await response.json();

                set({
                  user: { ...user, name: profileData.user?.name },
                  isLoggedIn: true,
                });
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
          const headers = {
            "Content-Type": "application/json",
            ...(user && user.accessToken
              ? { Authorization: `${user.accessToken}` }
              : {}),
          };

          const response = await fetch(
            "https://project-playgroundfinder-api.onrender.com/api/playgrounds",
            {
              method: "POST",
              headers: headers,
              body: JSON.stringify(playgroundData),
            }
          );

          const data = await response.json();

          if (!response.ok)
            throw new Error(data.message || "Failed to post playground");

          if (user) {
            set((state) => {
              const updatedUser = {
                ...state.user,
                savedPlaygrounds: [
                  ...state.user.savedPlaygrounds,
                  ...(data.playground ? [data.playground] : []),
                ],
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              return { user: updatedUser };
            });
          }
        } catch (err) {
          console.error("Error posting playground:", err);
        }
      },
      removePlayground: async (playgroundToRemove) => {
        try {
          const user = get().user;
          if (!user) throw new Error("User not logged in");

          if (!playgroundToRemove || !playgroundToRemove._id) {
            throw new Error("Playground ID is missing.");
          }

          const updatedPlaygrounds = user.savedPlaygrounds.filter(
            (pg) => String(pg._id) !== String(playgroundToRemove._id)
          );

          set((state) => ({
            user: {
              ...state.user,
              savedPlaygrounds: updatedPlaygrounds,
            },
          }));

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              savedPlaygrounds: updatedPlaygrounds,
            })
          );
        } catch (err) {
          console.error(
            "Error removing playground from localStorage:",
            err.message
          );
        }
      },
      logout: () => {
        try {
          const savedPlaygrounds = get().user?.savedPlaygrounds || [];
          // Stores savedPlaygrounds to localStorage
          localStorage.setItem(
            "savedPlaygrounds",
            JSON.stringify(savedPlaygrounds)
          );

          set({ user: null, isLoggedIn: false });
          localStorage.removeItem("user");
        } catch (err) {
          console.error("An error occurred while logging out:", err);
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
