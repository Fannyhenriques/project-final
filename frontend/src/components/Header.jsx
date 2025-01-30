import styled from "styled-components";
import { useState } from "react"
import { NavLink } from "react-router-dom";
import playground from "../assets/PlaygroundFinder.png";
import { routes } from "../utils/routes";
import { HamburgerMenu } from "./HamburgerMenu"
import { MenuItems } from "../ui/MenuItems"; // Import menuItems from the separate file
import { Homepage } from "../pages/Homepage"

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center; /* Centers content */
  align-items: center;
  padding: 15px 20px;
  height: 50px; 
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 35px; 
  z-index: 1;
`;

const HeaderImg = styled.img`
  position: absolute;
  left: 20px; /* Keeps logo on the left */
  width: 12rem;
  height: auto;
  padding: 5px; 

  @media (max-width: 768px) {
    width: 10rem;
    left: unset; /* Removes left positioning */
    margin: 0 auto; /* Centers the image */
    display: block; /* Ensures block behavior for centering */
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    display: none; //Hide regular navbar on mobile and tablet. 
  }

`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 20px; /* Adds spacing between links */
  margin: 0;
  padding: 0;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #053332;
  font-weight: bold;
  font-family: "Poppins";
  &:hover {
    color: #0f8381;
  }
`;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);  // Toggle the state of the menu
  };
  return (
    <div>
      <HeaderContainer>
        <HeaderImg src={playground} alt="Playground Finder Logo" />
        {/* Hamburger Menu (Only visible on smaller screens) */}
        <HamburgerMenu
          menuItems={MenuItems}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
        />
        {/* Regular Navbar (Only visible on larger screens) */}
        <Nav>
          <NavList>
            <StyledNavLink to={routes.home} aria-label="Go to Home page">Home</StyledNavLink>
            <StyledNavLink to={routes.login} aria-label="Go to Login page">Login</StyledNavLink>
            <StyledNavLink to={routes.profile} aria-label="Go to Profile">Profile</StyledNavLink>
            <StyledNavLink to={routes.about} aria-label="About PlayGroundFinder">About</StyledNavLink>
          </NavList>
        </Nav>
      </HeaderContainer>
      {/* Only render Homepage (with search bar) when menu is not open */}
      <Homepage isMenuOpen={isMenuOpen} />
    </div>
  );
};
