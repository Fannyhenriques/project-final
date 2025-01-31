// HamburgerMenu.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const HamburgerIcon = styled.div`
  display: none; 

  @media (max-width: 768px) {
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
      background-color: #053332;
      border-radius: 4px;
    }
  }
`;

const MenuBox = styled.div`
  position: fixed;
  top: 7.2rem;
  left: 0;
  background-color: #053332;
  width: 10rem;
  height: 20rem;
  padding: 0rem 0.5rem;
  flex-direction: column;
  align-items: flex-end;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  padding: 0rem 0.5rem;

  ul {
    list-style: none;
    padding-top: 70px;
    text-align: center;
  }

  li {
    padding: 0.5rem 0rem;
    font-size: 1rem;
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: 300;
    font-family: "Poppins";
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: white;
  font-size: 2rem;
  cursor: pointer;

  &:hover {
    color: #0f8381;
  }
`;

export const HamburgerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <HamburgerIcon onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </HamburgerIcon>

      <MenuBox isOpen={isMenuOpen}>
        {/* Close Button */}
        <CloseButton onClick={closeMenu}>×</CloseButton>

        <ul>
          <li>
            <NavLink to="/" activeClassName="active" aria-label="Go to Home page">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login" activeClassName="active" aria-label="Go to Login page">Login</NavLink>
          </li>
          <li>
            <NavLink to="/profile" activeClassName="active" aria-label="Go to Profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/about" activeClassName="active" aria-label="About PlayGroundFinder">About</NavLink>
          </li>
        </ul>
      </MenuBox>
    </>
  );
};