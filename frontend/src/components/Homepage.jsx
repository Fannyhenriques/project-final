import { useEffect, useState } from "react";
import styled from "styled-components";
import { Title } from "../ui/Typography";
import { MapLoader } from "./MapLoader";
import { getUserLocation } from "../hooks/getUserLocation"; // Adjust path as needed

const StyledTitle = styled(Title)`
  padding: 5px 0;
  margin-left: 10px;

  @media (max-width: 480px) {
    font-size: 1rem;
    color: black;
  }
`;

export const Homepage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [playgrounds, setPlaygrounds] = useState([]);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocationAndPlaygrounds = async () => {
      try {
        // Get user location
        const location = await getUserLocation();
        console.log("User Location:", location);
        setUserLocation(location);

        // Fetch playgrounds based on user location
        const response = await fetch(
          `https://project-playground-api.onrender.com/api/playgrounds?lat=${location.lat}&lng=${location.lng}`
        );
        const data = await response.json();
        console.log("Playgrounds Data:", data);
        setPlaygrounds(data);
      } catch (error) {
        console.error("Error fetching location or playgrounds:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationAndPlaygrounds();
  }, []); // Runs once on component mount

  const handleSearch = async () => {
    // Example: Placeholder for searching by address
    const results = await searchPlaygroundsByAddress(address); // Replace with actual function
    setPlaygrounds(results);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <StyledTitle>Find a playground</StyledTitle>
      <div>
        <input
          type="text"
          id="searchAddress"
          placeholder="Enter an address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {userLocation && (
        <MapLoader userLocation={userLocation} playgrounds={playgrounds} />
      )}
    </>
  );
};



//Att ändra i .env filen:
// GOOGLE_PLACES_URL=https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={LAT},{LNG}&radius={RADIUS}&keyword=playground