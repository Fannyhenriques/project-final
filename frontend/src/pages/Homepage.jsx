import { useEffect, useState } from "react";
import styled from "styled-components";
import { MapLoader } from "../components/MapLoader";
import { getUserLocation } from "../hooks/getUserLocation";


const SearchMapContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
`;

const SearchBarContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: white;
  opacity: 90%;
  border-radius: 15px;
  padding: 8px 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 80%; /* Adjust width for mobile */

  @media (min-width: 768px) {
    width: 400px; /* Adjust width for tablets and larger screens */
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 1rem;
  border-radius: 25px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

export const Homepage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [playgrounds, setPlaygrounds] = useState([]);
  const [address, setAddress] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLocationAndPlaygrounds = async () => {
      try {
        const location = await getUserLocation();
        console.log("User Location:", location);
        setUserLocation(location);

        if (!location || !location.lat || !location.lng) {
          throw new Error("Invalid location data");
        }

        const response = await fetch(
          `http://localhost:9000/api/playgrounds?lat=${location.lat}&lng=${location.lng}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch playgrounds: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Playgrounds Data:", data);

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
  }, []);

  const handleSearch = async () => {
    if (!address.trim()) {
      alert("Please enter a valid search term");
      return;
    }

    setSearchQuery(address);

    try {
      const radius = 2000;
      const url = `http://localhost:9000/api/playgrounds?name=${encodeURIComponent(address)}&radius=${radius}`;
      console.log("Request URL:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch playgrounds.");
      }

      const data = await response.json();
      console.log("Fetched playgrounds:", data);

      setPlaygrounds(data || []);
      if (data.length > 0) {
        const { coordinates } = data[0].location;
        if (coordinates && coordinates.length === 2) {
          setPlaygrounds((prevPlaygrounds) => [
            ...prevPlaygrounds,
            { coordinates: { lat: coordinates[1], lng: coordinates[0] } }
          ]);
        } else {
          alert("Invalid coordinates in response.");
        }
      } else {
        alert("No playgrounds found");
      }
    } catch (error) {
      console.error("Search Error:", error.message);
      alert("Failed to fetch playground data.");
    }
  };

  if (isFetchingData) return <p>Loading...</p>;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch(event);
    }
  };

  return (
    <SearchMapContainer>
      <SearchBarContainer>
        <SearchInput
          type="text"
          placeholder="Search for a playground..."
          value={address}
          onKeyDown={handleKeyDown}
          onChange={(event) => setAddress(event.target.value)}
        />
        {address && (
          <ClearButton onClick={() => setAddress("")} aria-label="Clear">
            X
          </ClearButton>
        )}
      </SearchBarContainer>
      {userLocation && (
        <MapLoader
          userLocation={userLocation}
          playgrounds={playgrounds}
          searchQuery={searchQuery}
          isFetchingData={isFetchingData}  // Pass loading state down to MapLoader
        />
      )}
    </SearchMapContainer>
  );
};


//Att göra
//Svensk/engelsk toogle





