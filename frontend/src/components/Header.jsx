import styled from "styled-components";
import playground from "../assets/PlaygroundFinder.svg";

// Styled component for the header container
const HeaderContainer = styled.header`
  display: flex;               /* Enable flexbox */
  align-items: center;         /* Vertically center the items */
  justify-content: flex-start; /* Align items to the left */
  padding: 10px 20px;          /* Add some padding around the container */
`;

const HeaderImg = styled.img`
  width: 15rem; /* Set the width of the logo */
  height: auto;
  margin-right: 20px; /* Add space between the logo and the text */
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <HeaderImg src={playground} alt="playground-img" />
    </HeaderContainer>
  );
};
