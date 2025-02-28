import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Homepage } from "./pages/Homepage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Activities } from "./pages/Activities";
import { About } from "./pages/About";
import { routes } from "./utils/routes";
import { PlaygroundDetails } from "./pages/PlaygroundDetails";

export const App = () => {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path={routes.home} element={<Homepage />} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.profile} element={<ProfilePage />} />
        <Route path={routes.activities} element={<Activities />} />
        <Route path={routes.about} element={<About />} />
        <Route path="/playgrounds/:playgroundId" element={<PlaygroundDetails />} />
      </Routes>
    </Router>
  );
};
