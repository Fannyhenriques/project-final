import { useEffect, useState } from "react"
import styled from "styled-components";
import { Title } from "../ui/Typography";
import { MapLoader } from "./MapLoader";
import { getUserLocation } from "../hooks/getUserLocation"; // adjust the path based on your project structure

const StyledTitle = styled(Title)`
  padding: 5px 0;
  margin-left: 10px; 
  /* Media query for mobile */
  @media (max-width: 480px) {
    font-size: 1rem;
    color: black;
  }
`;

export const Homepage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState(""); // State for the address input
  const [playgrounds, setPlaygrounds] = useState([]); // State for playground list
  const [isLoading, setIsLoading] = useState(true); // Single loading state for both data and location

  useEffect(() => {
    const fetchLocationAndPlaygrounds = async () => {
      setIsLoading(true); // Set loading true when fetching location and playgrounds

      try {
        const location = await getUserLocation();
        setUserLocation(location);


        // Fetch playgrounds using user location
        const response = await fetch(
          `https://project-playground-api.onrender.com/api/playgrounds?lat=${location.lat}&lng=${location.lng}`
        );
        const data = await response.json();
        setPlaygrounds(data);
      } catch (error) {
        console.error("Error fetching location or playgrounds:", error);
      } finally {
        setIsLoading(false); // Set loading to false when done fetching
      }
    };


    fetchLocationAndPlaygrounds();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>; // Display a single loading message
  }

  const handleSearch = () => {
    const results = searchPlaygroundsByAddress(address);
    setPlaygrounds(results); // Update the playground list with results
  };

  return (
    <>
      <StyledTitle>Find a playground</StyledTitle>
      <div>
        <input
          type="text"
          id="searchAddress"
          placeholder="Enter an address"
          value={address} // Bind input field value to state
          onChange={(event) => setAddress(event.target.value)} // Update state on input change
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {userLocation && (
        <MapLoader userLocation={userLocation} playgrounds={playgrounds} />
      )}
    </>
  );
};
