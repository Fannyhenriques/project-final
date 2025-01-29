import { styled } from 'styled-components';
import { useState } from 'react';

export const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Hamburger icon */}
      <HamburgerIcon onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </HamburgerIcon>

      {/* Menu content */}
      <MenuBox isOpen={isMenuOpen}>
        <CloseButton onClick={toggleMenu}>X</CloseButton>
        <ul>
          <li><a href="#library" onClick={toggleMenu}>Library</a></li>
          <li><a href="#personal-spells" onClick={toggleMenu}>Personalized Spells</a></li>
          <li><a href="/#about">About Daily Spells</a></li>
          <li><a href="/#terms">Terms of use</a></li>
        </ul>
      </MenuBox>
    </div>
  );
};

// Styled components for Hamburger and Menu
const HamburgerIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem; /* Position the hamburger menu at the top-right */
  width: 30px;
  height: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  div {
    width: 100%;
    height: 4px;
    background-color: white;
    border-radius: 4px;
  }
`;

const MenuBox = styled.div`
  position: fixed;
  top: 3.6875rem;
  right: 0;
  background-color: #360C25; /* Semi-transparent background */
  width: 9.1875rem; 
  height: 11rem;    
  padding: 0rem 0.5rem; 
  flex-direction: column;
  align-items: flex-end;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  padding: 0rem 0.5rem;

  ul {
    list-style: none;
    padding: 0;
    text-align: right;
  }

  li {
    padding: 0.5rem 0rem;
    font-size: 0.875rem;
  }

  a {
    color: white;
    text-decoration: none;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
    &:hover {
      color: #A05042;
    }
  }

  //Tablet
  @media (min-width: 768px) {
    width: 14rem; 
    height: 16rem;
    top: 2.84rem;
  

  li {
      font-size: 1.2rem;  /* Increase font size */
    }

    a {
      font-size: 1.2rem;  /* Increase font size for links */
    }
  
  }

  /* Desktop styling */
  @media (min-width: 1200px) {
    width: 15rem; 
    height: 17rem;
  

  li {
      font-size: 1.5rem; 
    }

    a {
      font-size: 1.5rem; 
    }
  }
`;

const CloseButton = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: white;
  cursor: pointer;
  font-size: 0.875rem; 

  
  //Tablet
  @media (min-width: 768px) {
  font-size: 1.2rem;  

  }
    
    /* Desktop styling */
  @media (min-width: 1200px) {
    font-size: 1.5rem; 
  }
`;