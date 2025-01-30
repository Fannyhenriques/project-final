import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
// import { usePlaygroundStore } from "../stores/usePlaygroundStore";

export const PlaygroundDetails = () => {
  const [playground, setPlayground] = useState(null);
  const { user, isLoggedIn, ratePlayground, postPlayground } = useUserStore();
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { playgroundId } = useParams(); // Extract ID from URL params
  console.log("Fetching playground details for:", playgroundId);

  useEffect(() => {
    const fetchPlaygroundDetails = async () => {
      try {
        setLoading(true);  // Set loading state to true before fetching
        const response = await fetch(`http://localhost:9000/api/playgrounds/id/${playgroundId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch playground details');
        }
        const data = await response.json();
        console.log("Playground details:", data);
        setPlayground(data); // Update playground state with fetched data
        setLoading(false);  // Set loading state to false once data is fetched
      } catch (error) {
        setError(error.message);  // Set error message if fetch fails
        setLoading(false);
      }
    };

    fetchPlaygroundDetails();
  }, [playgroundId]);

  if (loading) return <div>Loading...</div>; // Show loading text while waiting for the data
  if (error) return <div>Error: {error}</div>; // Show error message if there is an error

  // Calculate average rating if available
  const averageRating = playground.ratings && playground.ratings.length
    ? playground.ratings.reduce((sum, rating) => sum + rating, 0) / playground.ratings.length
    : null;

  //function to save a playground to profile
  const savePlayground = () => {
    if (!user) {
      console.error("User must be logged in to save a playground.");
      return;
    }

    // Assuming the playground data you want to save is in the `playground` state
    const playgroundData = {
      id: playgroundId,
      name: playground.name,
      description: playground.description,
      formatted_address: playground.formatted_address,
      photos: playground.photos,
      facilities: playground.facilities,
      location: playground.geometry ? {
        type: "Point",
        coordinates: [playground.geometry.location.lat, playground.geometry.location.lng]
      } : { type: "Point", coordinates: [0, 0] },
      // Add any other relevant fields to save
    };

    // Call the postPlayground function from your user store to save it
    console.log(playgroundData)
    postPlayground(playgroundData);
  };

  return (
    <div className="playground-details">
      <h1>{playground.name}</h1>

      {/* Display Photos */}
      <div className="playground-images">
        {playground.photos && playground.photos.length > 0 ? (
          playground.photos.map((image, index) => (
            <img
              key={index}
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${image.photo_reference}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`}
              alt={playground.name}
              style={{ width: "100%", height: "auto", marginBottom: "10px" }}
            />
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>

      {/* Description */}
      <p><strong>Description:</strong> {playground.description || "No description available."}</p>

      {/* Address */}
      <p><strong>Address:</strong> {playground.formatted_address || "No address available."}</p>

      {/* Phone Number */}
      {playground.formatted_phone_number && (
        <p><strong>Phone number: </strong> <a href={`tel:${playground.formatted_phone_number}`}>{playground.formatted_phone_number}</a></p>
      )}

      {/* Opening Hours */}
      {playground.opening_hours ? (
        <div>
          <strong>Opening Hours:</strong>
          <ul>
            {playground.opening_hours.weekday_text.map((day, index) => (
              <li key={index}>{day}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Opening hours not available.</p>
      )}

      {/* Facilities */}
      <div>
        <strong>Facilities:</strong>
        {playground.facilities && playground.facilities.length > 0 ? (
          <ul>
            {playground.facilities.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
          </ul>
        ) : (
          <p>No facilities listed.</p>
        )}
      </div>
      {playground.rating ? (
        <p>
          <strong>Rating:</strong> {playground.rating.toFixed(1)} / 5
        </p>
      ) : (
        <p>No ratings available.</p>
      )}
      <button onClick={savePlayground}>Save to Profile</button>
      {/* Location Map */}
      {playground.geometry && (
        <div id="map">
          <iframe
            src={`https://www.google.com/maps?q=${playground.geometry.location.lat},${playground.geometry.location.lng}&z=15&output=embed`}
            width="600"
            height="450"
            title="Playground Location"
          ></iframe>
        </div>
      )}
      {playground.reviews && playground.reviews.length > 0 ? (
        <div className="reviews-section">
          <h2>Reviews:</h2>
          {playground.reviews.map((review, index) => (
            <div key={index}>
              <div>
                <img
                  src={review.profile_photo_url}
                  alt={`${review.author_name}'s profile`}
                  className="profile-photo"
                />
                <a href={review.author_url} target="_blank" rel="noopener noreferrer">
                  {review.author_name}
                </a>
              </div>
              <div>Rating: {review.rating}</div>
              <div>{review.text}</div>
              <div>{review.relative_time_description}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};
