import { useEffect, useState } from "react";
import styled from "styled-components";
import { Title } from "../ui/Typography";
import { MapLoader } from "./MapLoader";
import { getUserLocation } from "../hooks/getUserLocation";

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
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchLocationAndPlaygrounds = async () => {
      try {
        // Get user location
        const location = await getUserLocation();
        console.log("User Location:", location);
        setUserLocation(location);

        // Check if location data is valid before proceeding
        if (!location || !location.lat || !location.lng) {
          throw new Error("Invalid location data");
        }

        // Fetch playgrounds based on user location
        const response = await fetch(
          `http://localhost:9000/api/playgrounds?lat=${location.lat}&lng=${location.lng}`
        );

        // Check if the fetch request was successful
        if (!response.ok) {
          throw new Error(`Failed to fetch playgrounds: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Playgrounds Data:", data);


        // Ensure the data is in the expected format before setting state
        if (Array.isArray(data)) {
          setPlaygrounds(data);

        } else {
          throw new Error("Invalid playgrounds data format");
        }
      } catch (error) {
        console.error("Error fetching location or playgrounds:", error.message);
      } finally {
        setIsFetchingData(false);
      }
    };



    fetchLocationAndPlaygrounds();
  }, []); // Runs once on component mount

  const handleSearch = async () => {
    if (!address.trim()) {
      alert("Please enter a valid search term")
      return;
    }

    setSearchQuery(address); // Pass the search query to MapLoader

    try {
      const radius = 2000; // 2km radius
      const url = `http://localhost:9000/api/playgrounds?name=${encodeURIComponent(address)}&radius=${radius}`
      console.log("Request URL:", url);
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch playgrounds.");
      }

      const data = await response.json();
      console.log("Fetched playgrounds:", data);

      setPlaygrounds(data || []);
      if (data.length > 0) {
        const { coordinates } = data[0].location; // Use the first search result
        if (coordinates && coordinates.length === 2) {
          setPlaygrounds(prevPlaygrounds => [
            ...prevPlaygrounds,
            { coordinates: { lat: coordinates[1], lng: coordinates[0] } } // Center the map
          ])
        } else {
          alert("Invalid coordinates in response.");
        }
      } else {
        alert("No playgrounds found")
      }
    } catch (error) {
      console.error("Search Error:", error.message);
      alert("Failed to fetch playground data.");
    }
  };

  if (isFetchingData) return <p>Loading...</p>;

  return (
    <>
      <StyledTitle>Find a playground</StyledTitle>
      <div>
        <input
          type="text"
          id="searchAddress"
          placeholder="Enter a name or address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {userLocation && (
        <MapLoader userLocation={userLocation} playgrounds={playgrounds} searchQuery={searchQuery} />
      )}
    </>
  );
}

//Att göra
//Svensk/engelsk toogle
//fixa design search bar
//Fixa UI/design för kartan och markers

