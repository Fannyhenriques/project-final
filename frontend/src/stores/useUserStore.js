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

          console.log("API Response:", data);

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

            localStorage.setItem("user", JSON.stringify(user));
            console.log("User registered and saved to localStorage:", user);

            set({ user, isLoggedIn: true });

          } else {
            console.error("User data not found in API response (missing userId or accessToken)");
          }
        } catch (err) {
          console.error("Registration failed:", err);
        }
      },
      // login: async (email, password) => {
      //   try {
      //     const response = await fetch("https://project-playground-api.onrender.com/user/login", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ email, password }),
      //     });

      //     const data = await response.json();

      //     console.log("Login response data:", data);

      //     if (!response.ok) {
      //       throw new Error(`Login failed: ${data.message || 'Unknown error'}`);
      //     }

      //     const userData = {
      //       id: data.userId,
      //       name: data.name,
      //       email: data.email,
      //       savedPlaygrounds: data.savedPlaygrounds || [],
      //       accessToken: data.accessToken,
      //     };

      //     localStorage.setItem("user", JSON.stringify(userData));
      //     console.log("Stored user in localStorage:", userData);

      //     set({ user: userData, isLoggedIn: true });

      //   } catch (err) {
      //     console.error("Login failed:", err);
      //   }
      // },
      login: async (email, password) => {
        try {
          const response = await fetch("https://project-playground-api.onrender.com/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          console.log("Login response data:", data);

          if (!response.ok) {
            throw new Error(`Login failed: ${data.message || 'Unknown error'}`);
          }

          const userData = {
            id: data.userId,
            name: data.name,
            email: data.email,
            accessToken: data.accessToken,
          };

          // Retrieve savedPlaygrounds from localStorage
          const savedPlaygrounds = JSON.parse(localStorage.getItem("savedPlaygrounds") || "[]");

          // Attach savedPlaygrounds to the user data
          userData.savedPlaygrounds = savedPlaygrounds;

          // Store the complete user data, including savedPlaygrounds
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("Stored user in localStorage:", userData);

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

      // postPlayground: async (playgroundData) => {
      //   try {
      //     const user = get().user;
      //     if (!user) throw new Error("User not logged in");

      //     const response = await fetch("https://project-playground-api.onrender.com/api/playgrounds", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `${user.accessToken}`,
      //       },
      //       body: JSON.stringify(playgroundData),
      //     });

      //     const data = await response.json();
      //     console.log("Playground data from API:", data);

      //     if (!response.ok) throw new Error(data.message || "Failed to post playground");

      //     set((state) => {
      //       const updatedUser = {
      //         ...state.user,
      //         savedPlaygrounds: [
      //           ...state.user.savedPlaygrounds,
      //           ...data.playground ? [data.playground] : []
      //         ],
      //       };
      //       localStorage.setItem("user", JSON.stringify(updatedUser));
      //       console.log("Updated savedPlaygrounds:", updatedUser.savedPlaygrounds);
      //       return { user: updatedUser };
      //     });

      //     console.log("Playground added:", data.playground);
      //   } catch (err) {
      //     console.error("Error posting playground:", err);
      //   }
      // },
      postPlayground: async (playgroundData) => {
        try {
          const user = get().user;

          // If user is logged in, use the accessToken, otherwise skip it
          const headers = {
            "Content-Type": "application/json",
            ...(user && user.accessToken ? { "Authorization": `${user.accessToken}` } : {}),
          };

          const response = await fetch("https://project-playground-api.onrender.com/api/playgrounds", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(playgroundData),
          });

          const data = await response.json();
          console.log("Playground data from API:", data);

          if (!response.ok) throw new Error(data.message || "Failed to post playground");

          // If user is logged in, update the savedPlaygrounds in the state and localStorage
          if (user) {
            set((state) => {
              const updatedUser = {
                ...state.user,
                savedPlaygrounds: [
                  ...state.user.savedPlaygrounds,
                  ...data.playground ? [data.playground] : []
                ],
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              console.log("Updated savedPlaygrounds:", updatedUser.savedPlaygrounds);
              return { user: updatedUser };
            });
          }

          console.log("Playground added:", data.playground);
        } catch (err) {
          console.error("Error posting playground:", err);
        }
      },
      removePlayground: async (playgroundToRemove) => {
        console.log("Received Playground to Remove:", playgroundToRemove);

        try {
          const user = get().user;
          if (!user) throw new Error("User not logged in");

          if (!playgroundToRemove || !playgroundToRemove._id) {
            throw new Error("Playground ID is missing.");
          }

          console.log("Playground ID to Remove:", playgroundToRemove._id);

          const updatedPlaygrounds = user.savedPlaygrounds.filter(
            (pg) => String(pg._id) !== String(playgroundToRemove._id)
          );

          set((state) => ({
            user: {
              ...state.user,
              savedPlaygrounds: updatedPlaygrounds,
            },
          }));

          localStorage.setItem("user", JSON.stringify({
            ...user,
            savedPlaygrounds: updatedPlaygrounds,
          }));

          console.log("Playground removed from localStorage and state successfully.");
        } catch (err) {
          console.error("Error removing playground from localStorage:", err.message);
        }
      },
      logout: () => {
        try {
          const savedPlaygrounds = get().user?.savedPlaygrounds || [];
          // Store savedPlaygrounds to localStorage
          localStorage.setItem("savedPlaygrounds", JSON.stringify(savedPlaygrounds));

          // Now clear user data
          set({ user: null, isLoggedIn: false });
          localStorage.removeItem("user"); // Remove user data from localStorage

          console.log("User logged out and saved playgrounds to localStorage.");
        } catch (err) {
          console.error("An error occurred while logging out:", err);
        }
      },

      // logout: () => {
      //   try {
      //     set({ user: null, isLoggedIn: false });
      //     localStorage.removeItem("user");
      //   } catch (err) {
      //     console.error("An error occurred while logging out:", err);
      //   }
      // },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);