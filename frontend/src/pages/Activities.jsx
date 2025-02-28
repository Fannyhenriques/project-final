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
        <StyledPageTitle>Activities</StyledPageTitle>
        <StyledText>
          Here you will find tips about other activities when you don´t want to go to a playground, perhaps it is raining or you just don´t have the time or effort.
        </StyledText>
      </ActivitiesSection>
    </CenteredContainer>
  );
}; 