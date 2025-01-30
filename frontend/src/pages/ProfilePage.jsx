import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, fetchUserProfile, logout, isLoading, error, postPlayground, removePlayground } = useUserStore();
  const navigate = useNavigate();

  const [newPlayground, setNewPlayground] = useState({
    name: '',
    description: '',
    address: '',
    facilities: '',
    images: '',
    location: { coordinates: [0, 0] },
  });

  const [postedPlaygrounds, setPostedPlaygrounds] = useState([]); // Store multiple posted playgrounds

  useEffect(() => {
    console.log("Profile updated, savedPlaygrounds:", user?.savedPlaygrounds);
  }, [user?.savedPlaygrounds]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

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
    return <p>Oops! It looks like you're not logged in. <br></br> Please log in or register to access your profile page.</p>;
  }

  const handleLogout = () => {
    logout(); // Performs the logout logic
    navigate("/login"); // Redirects to login page when logout button is clicked
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayground((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePostPlayground = async (e) => {
    e.preventDefault();
    await postPlayground(newPlayground);

    // Add the new playground to the list of posted playgrounds
    setPostedPlaygrounds((prev) => [...prev, newPlayground]);

    // Reset form after posting
    setNewPlayground({
      name: '',
      description: '',
      address: '',
      facilities: '',
      images: '',
      location: { coordinates: [0, 0] },
    });
  };

  const handleRemovePlayground = (playgroundToRemove) => {
    // Remove playground from the list
    setPostedPlaygrounds((prev) =>
      prev.filter((playground) => playground !== playgroundToRemove)
    );
    removePlayground(playgroundToRemove); // Assuming removePlayground is a zustand action
  };

  console.log('User Data:', user);
  console.log("Saved Playgrounds in Profile Component:", user?.savedPlaygrounds);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <h2>Your saved Playgrounds:</h2>
      {Array.isArray(user?.savedPlaygrounds) && user.savedPlaygrounds.length > 0 ? (
        <ul>
          {user.savedPlaygrounds.map((pg) => (
            <li key={pg.id}>{pg.name}</li>
          ))}
        </ul>
      ) : (
        <p>You have no saved playgrounds yet. Add some!</p>
      )}
      <h2>Add a New Playground:</h2>
      <form onSubmit={handlePostPlayground}>
        <div>
          <label>
            Name:
            <input type="text" name="name" value={newPlayground.name} onChange={handleInputChange} required />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea name="description" value={newPlayground.description} onChange={handleInputChange} required />
          </label>
        </div>
        <div>
          <label>
            Address:
            <input type="text" name="address" value={newPlayground.address} onChange={handleInputChange} required />
          </label>
        </div>
        <div>
          <label>
            Facilities:
            <input type="text" name="facilities" value={newPlayground.facilities} onChange={handleInputChange} required />
          </label>
        </div>
        <div>
          <label>
            Images (optional):
            <input type="text" name="images" value={newPlayground.images} onChange={handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Location Coordinates (optional):
            <input
              type="text"
              name="location"
              value={newPlayground.location.coordinates.join(", ")}
              onChange={(e) =>
                setNewPlayground((prev) => ({
                  ...prev,
                  location: {
                    coordinates: e.target.value.split(",").map(Number),
                  },
                }))
              }
            />
          </label>
        </div>
        <button type="submit">Post Playground</button>
      </form>

      <h2>Your Posted Playgrounds:</h2>
      {/* Render posted playgrounds */}
      {postedPlaygrounds.length > 0 ? (
        <ul>
          {postedPlaygrounds.map((playground, index) => (
            <li key={index}>
              <p><strong>Name:</strong> {playground.name}</p>
              <p><strong>Description:</strong> {playground.description}</p>
              <p><strong>Address:</strong> {playground.address}</p>
              <p><strong>Facilities:</strong> {playground.facilities}</p>
              <p><strong>Location:</strong> {playground.location.coordinates.join(", ")}</p>
              {/* Optionally, you can display images here */}
              <button onClick={() => handleRemovePlayground(playground)}>Remove Playground</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No playgrounds posted yet.</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};


//   return (
//     <div>
//       <h1>Welcome, {user.name}</h1> {/* Access the user's name directly */}
//       <h2>Your saved Playgrounds:</h2>
//       {user?.savedPlaygrounds?.length > 0 ? (
//         <ul>
//           {user.savedPlaygrounds.map((pg) => (
//             <li key={pg.id}>{pg.name}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>You have no saved playgrounds yet. Add some! </p>
//       )}
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };
