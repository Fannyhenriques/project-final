import styled from "styled-components";

// Styled component for grid
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);  
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box; 

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);  
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;  
  }
`;

const Image = styled.img`
  width: 100%;  
  height: 100%;  
  object-fit: cover;  
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0;
  display: block;  
  aspect-ratio: 1;  
  box-sizing: border-box; 
 

  @media (max-width: 768px) {  
    height: 150px;  
  }

  @media (max-width: 480px) {  
    height: 120px;  
    width: 100%; 
    padding: 5px;  
  }
`;

export const ImageGrid = ({ photos }) => {
  return (
    <Grid>
      {photos && photos.length > 0 ? (
        photos.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="Playground"
          />
        ))
      ) : (
        <p>No images available.</p>
      )}
    </Grid>
  );
};