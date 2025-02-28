import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { usePlaygroundStore } from "../stores/usePlaygroundStore";

const HamburgerIcon = styled.div`
  display: none; 

  @media (max-width: 1000px) {
    display: flex;
    position: absolute;
    top: 1.5rem;
    left: 1rem; 
    width: 30px;
    height: 25px;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;

    div {
      width: 100%;
      height: 4px;
      background-color: ${({ $isOpen }) => ($isOpen ? "#E6FA54" : "white")};
      border-radius: 4px;
      transition: all 0.3s ease-in-out;
    }
  

  div:nth-child(1) {
      transform: ${({ $isOpen }) => ($isOpen ? "rotate(45deg) translate(7px, 7px)" : "none")};
    }
    
    div:nth-child(2) {
      opacity: ${({ $isOpen }) => ($isOpen ? "0" : "1")};
    }
    
    div:nth-child(3) {
      transform: ${({ $isOpen }) => ($isOpen ? "rotate(-45deg) translate(7px, -7px)" : "none")};
    }
  }
`;


const MenuBox = styled.div` 
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #315a5c; 
  width: 11rem;
  height: 18rem;
  padding: 0rem 0.5rem;
  flex-direction: column;
  align-items: flex-end;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  padding: 0rem 0.5rem;

  ul {
    list-style: none;
    padding-top: 30px;
    text-align: center;
    padding-bottom: 20px; 
  }

  li {
    padding: 0.5rem 0rem;
    font-size: 1.5rem;

    @media (max-width: 768px) {
    font-size: 1.3rem; 
    }

    
    @media (max-width: 480px) {
    font-size: 1.2rem; 
    }
  }

  a { 
    color: white;
    text-decoration: none;
    font-weight: 300;
    font-family: "Poppins";
  &:hover {
    color: #E6FA54;
  }
  }

  @media (min-width: 1001px) {
    display: none;
  }

  @media (min-width: 768px) {
    width: 14rem;
    height: 19rem;
  }
`;

export const HamburgerMenu = () => {
  const { isMenuOpen, toggleMenu, closeMenu } = usePlaygroundStore();

  return (
    <>
      <HamburgerIcon onClick={toggleMenu} $isOpen={isMenuOpen}>
        <div></div>
        <div></div>
        <div></div>
      </HamburgerIcon>

      <MenuBox $isOpen={isMenuOpen}>
        {/* Close Button
        <CloseButton onClick={closeMenu}>×</CloseButton> */}

        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} aria-label="Go to Home page">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")} aria-label="Go to Login page">Login</NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")} aria-label="Go to Profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/activities" className={({ isActive }) => (isActive ? "active" : "")} aria-label="Go to Activities">Activities</NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")} aria-label="About PlayGroundFinder">About</NavLink>
          </li>
        </ul>
      </MenuBox>
    </>
  );
};