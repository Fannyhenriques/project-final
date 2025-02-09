import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { MapLoader } from "../components/MapLoader";
import { getUserLocation } from "../hooks/getUserLocation";
import { usePlaygroundStore } from "../stores/usePlaygroundStore";
import loadingAnimation from "../assets/Animation - 1739129648764.json";
import { Text } from "../ui/Typography"


const StyledText = styled(Text)`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const LoaderContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center; 
padding-top: 100px; 
`;

const SearchMapContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
`;

const SearchBarContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: white;
  opacity: 95%; 
  border-radius: 15px;
  padding: 8px 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 80%; 
  display: ${({ $isMenuOpen }) => ($isMenuOpen ? "none" : "flex")};

  @media (min-width: 768px) {
    width: 400px; 
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
  color: #444444;
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
  const isMenuOpen = usePlaygroundStore((state) => state.isMenuOpen);

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
          `https://project-playground-api.onrender.com/api/playgrounds?lat=${location.lat}&lng=${location.lng}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Request-Method": "GET",
              "Access-Control-Request-Headers": "Content-Type",
            },
          }
        );
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
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
      const url = `https://project-playground-api.onrender.com/api/playgrounds?name=${encodeURIComponent(address)}&radius=${radius}`;
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

  if (isFetchingData) {

    return (
      <LoaderContainer>
        <StyledText>Loading Playground Map...</StyledText>
        <Lottie animationData={loadingAnimation} loop={true} />
      </LoaderContainer>
    );
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch(event);
    }
  };

  return (
    <SearchMapContainer>
      <SearchBarContainer $isMenuOpen={isMenuOpen}>
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
          isFetchingData={isFetchingData}
        />
      )}
    </SearchMapContainer>
  );
};