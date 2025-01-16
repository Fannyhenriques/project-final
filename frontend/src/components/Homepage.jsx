import styled from "styled-components";
import { Title } from "../ui/Typography";
import { useState } from "react"; // Import useState hook

const StyledTitle = styled(Title)`
  padding: 5px 0;
  /* Media query for mobile */
  @media (max-width: 480px) {
    font-size: 1.8rem;
    color: black;
  }
`;

// Styled component for the map container
const MapContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 500px;
  background-image: url("/path/to/your/map.jpg"); /* Replace with your map image */
  background-size: cover;
  background-position: center;
`;

const PlaygroundSpot = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: green;
  }
`;

// const searchPlaygroundsByAddress = (address) => {
//   // Function logic to search for playgrounds by address
//   console.log("Searching playgrounds at:", address);
//   // Mock playground spots coordinates (percentages relative to the map's size)
//   return [
//     { name: "Playground 1", x: "30%", y: "40%" },
//     { name: "Playground 2", x: "60%", y: "60%" },
//     { name: "Playground 3", x: "50%", y: "20%" },
//   ];
// };

export const Homepage = () => {
  const [address, setAddress] = useState(""); // State for the address input
  const [playgrounds, setPlaygrounds] = useState([]); // State for playground list

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
          onChange={(e) => setAddress(e.target.value)} // Update state on input change
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Map with playground spots */}
      <MapContainer>
        {playgrounds.map((playground, index) => (
          <PlaygroundSpot
            key={index}
            style={{
              left: playground.x,
              top: playground.y,
            }}
            title={playground.name}
          />
        ))}
      </MapContainer>

      <ul id="playgroundList">
        {playgrounds.map((playground, index) => (
          <li key={index}>{playground.name}</li>
        ))}
      </ul>
    </>
  );
};