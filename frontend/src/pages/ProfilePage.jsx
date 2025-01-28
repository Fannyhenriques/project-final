import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, fetchUserProfile, logout, isLoading, error } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile(); // Fetch the user profile when the component mounts
  }, [fetchUserProfile]);

  // Check loading, error, and user states inside the return block
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={fetchUserProfile}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return <p>No user found.</p>; // Ensure the user is available before rendering
  }

  const handleLogout = () => {
    logout(); // Perform the logout logic
    navigate("/login"); // Redirect to login page
  };

  console.log('User Data:', user);
  // Render the profile page when everything is ready
  return (
    <div>
      <h1>Welcome, {user.name}</h1> {/* Access the user's name directly */}
      <h2>Your saved Playgrounds:</h2>
      {user?.savedPlaygrounds?.length > 0 ? (
        <ul>
          {user.savedPlaygrounds.map((pg) => (
            <li key={pg.id}>{pg.name}</li>
          ))}
        </ul>
      ) : (
        <p>You have no saved playgrounds yet. Add some! </p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
