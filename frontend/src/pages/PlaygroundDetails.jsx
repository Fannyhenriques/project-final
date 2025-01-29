import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export const PlaygroundDetails = () => {
  const { place_id } = useParams(); // Get place_id from URL params
  const [playground, setPlayground] = useState(null);

  useEffect(() => {
    const fetchPlaygroundDetails = async () => {
      try {
        // API call to backend using the place_id
        const response = await fetch(`http://localhost:9000/api/playgrounds/id/${place_id}`);
        const data = await response.json();
        setPlayground(data); // Update state with the playground details
      } catch (error) {
        console.error("Error fetching playground details:", error);
      }
    };

    fetchPlaygroundDetails();
  }, [place_id]); // Re-fetch when place_id changes

  if (!playground) return <div>Loading...</div>;

  // Calculate average rating if available
  const averageRating = playground.ratings.length
    ? playground.ratings.reduce((sum, rating) => sum + rating, 0) / playground.ratings.length
    : null;

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
        <p><strong>Phone:</strong> <a href={`tel:${playground.formatted_phone_number}`}>{playground.formatted_phone_number}</a></p>
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

      {/* Average Rating */}
      {averageRating ? (
        <p>
          <strong>Average Rating:</strong> {averageRating.toFixed(1)} / 5
        </p>
      ) : (
        <p>No ratings available.</p>
      )}

      {/* Source */}
      <div>
        <strong>Source:</strong> {playground.source || "Unknown"}
      </div>

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
    </div>
  );
};


