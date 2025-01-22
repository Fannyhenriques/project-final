import React from "react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><NavLink to={routes.home}>Home</NavLink></li>
        <li><NavLink to={routes.login}>Login</NavLink></li>
        <li><NavLink to={routes.register}>Register</NavLink></li>
        <li><NavLink to={routes.profile}>Profile</NavLink></li>
      </ul>
    </nav>
  );
};