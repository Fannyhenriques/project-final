import styled from "styled-components"

// Font families (e.g., primary for headings, secondary for paragraphs)
export const primaryFont = "Poppins";

// Heading 1
export const Title = styled.h1`
  font-family: ${primaryFont};
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #FFF;
`;

// Heading 2
export const PageTitle = styled.h2`
  font-family: ${primaryFont};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.3;
  margin: 0; /* Reset margin */
  color: #FFF;
`;

//Heading 3
export const SubPageTitle = styled.h3`
font-family: ${primaryFont};
font-size: 1.3rem;
font-weight: 400;
line-height: 1.4;
color: #053332; 
 `;

// Paragraph text
export const Text = styled.p`
font-family: ${primaryFont};
font-size: 1rem;
font-weight: 400;
line-height: 1.3;
color: #FFF;
`;
