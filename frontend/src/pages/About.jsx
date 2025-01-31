import styled from "styled-components";
import { PageTitle, Text } from "../ui/Typography";

const StyledPageTitle = styled(PageTitle)`
  padding: 40px 0px 10px;
`;

const AboutSection = styled.section`
  max-width: 600px;
  padding: 0 20px;
`;

const TextWithSpacing = styled(Text)`
  margin-bottom: 20px; 
`;

const BoldText = styled(Text)`
  font-weight: 500; 
  margin-bottom: 20px; 
`;

export const About = () => {
  return (
    <div>
      <AboutSection>
        <StyledPageTitle>About PlaygroundFinder</StyledPageTitle>
        <TextWithSpacing>
          Welcome to PlaygroundFinder, your go-to app for discovering the best playgrounds near you! Whether you're a parent looking for a safe and fun place for your kids, or just someone who enjoys outdoor spaces, PlaygroundFinder helps you explore and find playgrounds with ease.
        </TextWithSpacing>
        <TextWithSpacing>
          Features:
          ✅ Search for Playgrounds – Find playgrounds in your area with detailed information.
          ✅ Playground Details – View amenities, ratings, and photos before you visit.
          ✅ User Reviews & Ratings – Read and share experiences with the community.
          ✅ Interactive Map – Navigate easily to your selected playground.
          ✅ Save Your Favorites – Bookmark playgrounds you love for quick access.
        </TextWithSpacing>
        <TextWithSpacing>

          At PlaygroundFinder, we believe that outdoor play is essential for children’s development and well-being. Our goal is to make it easier for families to find great play spaces, ensuring every adventure is just a tap away!

          Start exploring today and make outdoor play more accessible for everyone!
        </TextWithSpacing>
        <BoldText>
          This page was created as part of the final student project for the Technigo Bootcamp, January 2025, created by Anna Hansen and Fanny Henqriques.
        </BoldText>
      </AboutSection>
    </div>
  );
};