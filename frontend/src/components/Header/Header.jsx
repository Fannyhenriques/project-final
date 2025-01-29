import styled from "styled-components";
import playground from "../../assets/PlaygroundFinder.png";
import { Navbar } from "../Navbar";


// Styled component for the header container
const HeaderContainer = styled.header`
  display: flex;                /* Enable flexbox */
  flex-direction: column;        /* Arrange items vertically */
  align-items: left;           /* Center the items horizontally */
  justify-content: left;       /* Center the items vertically */
  padding: 5px;  
  background-color:white;
  box-shadow:  10px 5px 5px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  margin-top: 30px; 
  

  
  @media (max-width: 480px) {
    align-items: center;           /* Center the items horizontally on mobile*/
    justify-content: center;
  }
`;

const HeaderImg = styled.img`
  width: 25rem;                  
  height: auto;   
  
  @media (min-width: 768px) {
    width: 15rem; /* Adjust width for tablets and larger screens */
  }
  
  @media (max-width: 480px) {
    width: 10rem;
  }  
  
 
`;

export const Header = () => {
  return (
    // <header>
    <HeaderContainer>
      <Navbar />
      <HeaderImg src={playground} alt="playground-img" />
    </HeaderContainer>
    // {/* </header> */}
  );
};
