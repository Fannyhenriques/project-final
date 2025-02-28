import styled from "styled-components";
import { PageTitle, Text } from "../ui/Typography";

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

const ActivitiesSection = styled.section`
  max-width: 1000px;
  padding: 0 20px;
  margin: 0 auto; 
`;

const StyledText = styled(Text)`
  padding: 10px 0px 10px;
`;


const CenteredContainer = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center; 
`;

export const Activities = () => {
  return (
    <CenteredContainer>
      <ActivitiesSection>
        <StyledPageTitle>Upcoming Feature: Activities</StyledPageTitle>
        <StyledText>
          Soon, you'll find great tips for fun activities beyond playground visits! Whether it's raining, you're short on time, or just in the mood for something different, we’ll have plenty of ideas for you. Stay tuned!
        </StyledText>
      </ActivitiesSection>
    </CenteredContainer>
  );
}; 