import styled from "styled-components";
import playground from "../assets/PlaygroundFinder.png";


// Styled component for the header container
const HeaderContainer = styled.header`
  display: flex;                /* Enable flexbox */
  flex-direction: column;        /* Arrange items vertically */
  align-items: center;           /* Center the items horizontally */
  justify-content: center;       /* Center the items vertically */
  padding-top: 20px;                 /* Add some padding around the container */          /* Add some space below the header */
`;

const HeaderImg = styled.img`
  width: 30rem;                  
  height: auto;                     
  
  @media (max-width: 480px) {
    width: 10rem;
  }     
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <HeaderImg src={playground} alt="playground-img" />
    </HeaderContainer>
  );
};
