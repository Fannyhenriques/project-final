import { useEffect, useState } from "react";
import styled from "styled-components";
import { Title } from "../ui/Typography";
import { MapLoader } from "./MapLoader";
import { getUserLocation } from "../hooks/getUserLocation";

// Styled component for the content container
const StyledContent = styled.div`
  display: flex;                  /* Enable flexbox */
  flex-direction: column;          /* Stack the title and the input vertically */
  align-items: flex-start;         /* Left-align the title */
  justify-content: flex-start;     /* Align content to the top */
  width: 100%;            /* Add space around the content */
`;

const StyledTitle = styled(Title)`
  margin-left: 10px;  /* Left margin to keep the title away from the edge */

  @media (max-width: 480px) {
    font-size: 1rem;
    color: black;
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: space-between;   /* Space between Textarea and Button */
  width: 100%;
  max-width: 300px;                 /* Adjust max-width to control the size */
  margin-top: 10px;                 /* Add some space between title and search bar */
`;

const Textarea = styled.textarea`
  resize: none;
  padding: 10px;
  margin: 0px 0px 5px;
  width: 60%;  /* Set width of Textarea */
  height: 30%; 
  border-radius: 15px;
  box-sizing: border-box;
  font-size: 14px;

`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7rem;
  height: 3rem;
  padding: 0.5rem;
  background: #9AC4C0;
  box-shadow: 5px 5px 5px rgba(33, 33, 33, 0.7);
  border-radius: 15px;
  color: #000;
  font-size: 16px;
  font-family: "Poppins";
  margin: 5px 0px 10px 5px; 
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch(event);
    }
  };


  return (
    <>
      <StyledContent>
        <StyledTitle>Find a playground</StyledTitle>
        <SearchBarContainer>
          <Textarea
            type="text"
            id="searchAddress"
            placeholder="Enter a playground or city..."
            value={address}
            onKeyDown={handleKeyDown}
            onChange={(event) => setAddress(event.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </SearchBarContainer>
      </StyledContent>
      {userLocation && (
        <MapLoader userLocation={userLocation} playgrounds={playgrounds} searchQuery={searchQuery} />
      )}
    </>
  );
}

//Att göra
//Svensk/engelsk toogle
//fixa design search bar




