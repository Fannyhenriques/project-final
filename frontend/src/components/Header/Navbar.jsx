import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "./Menu"


const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  background-color: white;
  box-shadow:  10px 5px 5px rgba(0, 0, 0, 0.3);
  width: 100%;
  
  height: 4.5rem;
  flex-shrink: 0;

  /* Media query for mobile */
  @media (max-width: 480px) {
    height: 3.5rem;
  }

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
          <li><a href="#Home" onClick={toggleMenu}>Library</a></li>
          <li><a href="#personal-spells" onClick={toggleMenu}>Personalized Spells</a></li>
          <li><a href="/#about">About Daily Spells</a></li>
          <li><a href="/#terms">Terms of use</a></li>
        </ul>
      </MenuBox>
  );
};
`;

const NavLink = styled.li`
  display: flex; 
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
`;

export const Navbar = () => {
  return (
    <Nav>
      <ul>

        <li><NavLink to={routes.home}>Home</NavLink></li>
        <li><NavLink to={routes.login}>Login</NavLink></li>
        <li><NavLink to={routes.register}>Register</NavLink></li>
        <li><NavLink to={routes.profile}>Profile</NavLink></li>
      </ul>
      {/* Menu component will show when isMenuOpen is true */}
      <Menu isOpen={isMenuOpen} closeMenu={toggleMenu} />
    </Nav>
  );
};