import styled from "styled-components"
import playground from "../assets/Playground.png"

const HeaderImg = styled.img`
  max-width: 100%;    
  width: 4rem;
  height: auto;

   @media (max-width: 480px) {
   width: 3rem; 

  }
`;

export const Header = () => {
  return (
    <header>
      <HeaderContent>
      <HeaderImg src= {playground}alt="playground-img" className="playground"/>
      <h1>Find Nearest Playgrounds</h1>
      <div>
      <input type="text" id="searchAddress" placeholder="Enter an address">
      <button onclick="searchPlaygroundsByAddress()">Search</button>
      </div>
      <ul id="playgroundList"></ul>
      </HeaderContent>
    </header>
  )
}
