import styled from "styled-components";
import { PageTitle, SmallText, Text } from "../ui/Typography";
import playgroundmarker from "../assets/Playground_marker.png";

const StyledPageTitle = styled(PageTitle)`
  padding: 60px 0px 7px;
  display: flex;
  justify-content: center;

  @media (max-width: 480px) {
    padding: 40px 0px 7px;
    font-size: 1.3rem; 
    justify-content: left;
  }
`;

const AboutSection = styled.section`
  max-width: 1000px;
  padding: 0 20px;
  margin: 0 auto; 
`;

const StyledText = styled(Text)`
  padding: 10px 0px 10px;
`;

const TextWithSpacing = styled(Text)`
  margin-bottom: 15px; 
`;

const StyledImage = styled.img`
  width: 2rem; 
  height: auto;
  margin-right: 8px; 
`;

const StyledList = styled.ul`
  list-style: none; 
  padding: 0;
`;

const StyledListItem = styled.li`
  display: flex;
  align-items: center; 
  margin-bottom: 10px; 
`;

const TributeText = styled(SmallText)`
  padding: 10px 0px 10px;
  text-align: center; 
  display: block; 
  `;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center; 
`;

export const About = () => {
  return (
    <CenteredContainer>
      <AboutSection>
        <StyledPageTitle>About PlaygroundFinder</StyledPageTitle>
        <StyledText>
          Welcome to PlaygroundFinder, your go-to app for discovering the best playgrounds near you! Whether you're a parent looking for a safe and fun place for your kids, or just someone who enjoys outdoor spaces, PlaygroundFinder helps you explore and find playgrounds with ease.
        </StyledText>
        <TextWithSpacing>
          <TextWithSpacing>Features:</TextWithSpacing>
          <StyledList>
            <StyledListItem>
              <StyledImage src={playgroundmarker} alt="marker" />
              Search for Playgrounds – Find playgrounds in your area or all over the world, with detailed information.
            </StyledListItem>
            <StyledListItem>
              <StyledImage src={playgroundmarker} alt="marker" />
              Playground Details – View amenities, ratings, and photos before you visit.
            </StyledListItem>
            <StyledListItem>
              <StyledImage src={playgroundmarker} alt="marker" />
              User Reviews & Ratings – Read and share experiences with the community.
            </StyledListItem>
            <StyledListItem>
              <StyledImage src={playgroundmarker} alt="marker" />
              Interactive Map – Navigate easily to your selected playground.
            </StyledListItem>
            <StyledListItem>
              <StyledImage src={playgroundmarker} alt="marker" />
              Save Your Favorites – Bookmark playgrounds you love for quick access.
            </StyledListItem>
          </StyledList>
        </TextWithSpacing>
        <StyledText>
          At PlaygroundFinder, we believe that outdoor play is essential for children’s development and well-being. Our goal is to make it easier for families to find great play spaces, ensuring every adventure is just a tap away!
          Start exploring today and make outdoor play more accessible for everyone!
        </StyledText>
        <StyledText>
          This page was created as part of the final student project for the Technigo Bootcamp, January 2025, created by <a href="https://github.com/Anna2024WebDev">Anna Hansen</a> and <a href="https://github.com/Fannyhenriques">Fanny Henriques</a>.
        </StyledText>
        <TributeText>Images on the profile page and in the navbar are from <a href="https://www.flaticon.com">Flaticon</a></TributeText>
      </AboutSection>
    </CenteredContainer>
  );
}; 