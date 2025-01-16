import { Header } from "./components/Header"
import { Homepage } from "./components/Homepage";
import { GlobalStyles } from "./styles/GlobalStyles";



export const App = () => {

  return (
    <>
      <GlobalStyles />
      <Header />
      <Homepage />
    </>
  );
};
