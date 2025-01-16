import styled from "styled-components";
import playground from "../assets/PlaygroundFinder.svg";


// Styled component for the header image
const HeaderImg = styled.img`
  align-items: center; 
  max-width: 100%;    
  width: 40rem;
  height: auto;

  @media (max-width: 480px) {
    width: 10rem; 
  }
`;

const searchPlaygroundsByAddress = () => {
  console.log('Searching playgrounds...');
};

export const Header = () => {
  return (
    <header>
      <HeaderImg src={playground} alt="playground-img" className="playground" />
    </header>
  );
};
