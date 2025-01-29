import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { Homepage } from "./components/Homepage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { routes } from "./utils/routes";

export const App = () => {

  return (
    <Router>
      <Navbar />
      <Header />
      <Routes>
        <Route path={routes.home} element={<Homepage />} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.profile} element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};
