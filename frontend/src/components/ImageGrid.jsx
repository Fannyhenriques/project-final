import styled from "styled-components";

// Styled component for grid
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);  // 4 columns on desktop
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box; // Ensures the container does not overflow

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);  // 2 columns on tablet
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;  // 1 column on mobile
  }
`;

// Styled component for image
const Image = styled.img`
  width: 100%;  // Image takes full width of grid cell
  height: 200px;  // Fixed height to ensure uniformity
  object-fit: cover;  // Ensure images are cropped and maintain aspect ratio
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0;
  display: block;  // Prevents any unwanted space under images
`;

// ImageGrid now just displays the photos passed to it via the "photos" prop
export const ImageGrid = ({ photos }) => {
  return (
    <Grid>
      {photos && photos.length > 0 ? (
        photos.map((image, index) => (
          <Image
            key={index}
            src={image}  // Assumes the "src" is already part of the photo object
            alt="Playground"
          />
        ))
      ) : (
        <p>No images available.</p>
      )}
    </Grid>
  );
};
