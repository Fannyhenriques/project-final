import { NavLink } from "react-router-dom";
import { routes } from "../utils/routes";

export const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><NavLink to={routes.home}>Home</NavLink></li>
        <li><NavLink to={routes.login}>Login</NavLink></li>
        <li><NavLink to={routes.profile}>Profile</NavLink></li>
      </ul>
    </nav>
  );
};