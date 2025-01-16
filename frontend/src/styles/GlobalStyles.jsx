import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    margin: 0;
    font-family: 'Poppins', sans-serif; /* Global font for text */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
  }

  html, body {
    margin: 0;  /* Remove default margin */
    padding: 0; /* Remove default padding */
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #d1ecea; 
    background-size: cover;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;  /* Allow absolute positioning for child elements */
  }

  /* Apply specific font family for headings */
  h1, h2, h3, p {
    font-family: 'Anton', sans-serif; /* Set font for headings */
  }
`;
