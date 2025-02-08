import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { usePlaygroundStore } from "../stores/usePlaygroundStore";
import styled from "styled-components";
import { ImageGrid } from "../components/ImageGrid";
import { Text, PageTitle } from "../ui/Typography";

const CenteredContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  color: white;
  font-family: "Poppins", sans-serif;
  `;

const Title = styled(PageTitle)`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
  `;

const Phone = styled(Text)`
  margin: 10px 10px 10px;
  `;

const OpeningHours = styled(Text)`
  margin: 0 auto;
  padding-left: 10px; 
  `;

const Facilities = styled(Text)`
  margin-top: 1rem;
  padding-left: 10px; 
  `;

const Rating = styled(Text)`
  margin-top: 1rem;
  padding-left: 10px; 
  `;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  `;

const SaveButton = styled.button`
  margin-bottom: 2rem;
  padding: 10px 20px;
  background-color: white;
  color: #053332;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  margin: 0 auto;
  margin: 10px 10px 20px; 
  `;

const Map = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  iframe {
    width: 100%;
    height: 450px;
    border: none;
  }

  @media (max-width: 768px) {
    iframe {
      height: 300px;
    }
  }

  @media (max-width: 480px) {
    iframe {
      height: 250px;
    }
  }
  `;

const Reviews = styled(CenteredContainer)`
  margin-top: 2rem;
  `;

const Review = styled.div`
  margin-bottom: 1rem;
  font-family: "Poppins", sans-serif;
  `;

const ReviewPhoto = styled.img`
  width: 100px;
  height: 100px;
  `;

const AuthorName = styled.a`
  padding-left: 1rem;
  color: white;
  text-decoration: none;
  `;

const ReviewText = styled.div`
  font-weight: 200;
  `;

const ImageSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
  `;

const StyledP = styled(Text)`
  margin: 0 auto;
  `;

export const PlaygroundDetails = () => {
  const [playground, setPlayground] = useState(null);
  const { user, postPlayground } = useUserStore();
  const { ratePlayground } = usePlaygroundStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playgroundId } = useParams();
  const navigate = useNavigate();
  console.log("Fetching playground details for:", playgroundId);

  useEffect(() => {
    const fetchPlaygroundDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://project-playground-api.onrender.com/api/playgrounds/id/${playgroundId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch playground details');
        }
        const data = await response.json();
        console.log("Playground details:", data);
        setPlayground(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPlaygroundDetails();
  }, [playgroundId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("Playground data state:", playground);

  const formattedPhotos = playground.photos?.map(
    (photo) =>
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
  ) || [];

  const savePlayground = () => {
    if (!user) {
      console.error("User must be logged in to save a playground.");
      return;
    }

    const playgroundData = {
      id: playgroundId,
      name: playground.name,
      description: playground.description,
      formatted_address: playground.formatted_address,
      photos: playground.photos,
      facilities: playground.facilities,
      location: playground.geometry ? {
        type: "Point",
        coordinates: [playground.geometry.location.lat, playground.geometry.location.lng]
      } : { type: "Point", coordinates: [0, 0] },
    };

    console.log(playgroundData)

    postPlayground(playgroundData);
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  return (
    <div>
      <Title>{playground.name}</Title>
      <ImageSection>
        {formattedPhotos.length > 0 ? (
          <ImageGrid photos={formattedPhotos} />
        ) : (
          <StyledP>No images available.</StyledP>
        )}
      </ImageSection>
      {playground.formatted_phone_number && (
        <Phone>
          <p><strong>Phone number: </strong> <a href={`tel:${playground.formatted_phone_number}`}>{playground.formatted_phone_number}</a></p>
        </Phone>
      )}
      {playground.opening_hours ? (
        <OpeningHours>
          <strong>Opening Hours:</strong>
          <ul>
            {playground.opening_hours.weekday_text.map((day, index) => (
              <li key={index}>{day}</li>
            ))}
          </ul>
        </OpeningHours>
      ) : (
        <StyledP>Opening hours not available.</StyledP>
      )}
      <div>
        <Facilities>
          <strong>Facilities:</strong>
          {playground.facilities && playground.facilities.length > 0 ? (
            <ul>
              {playground.facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
          ) : (
            <StyledP>No facilities listed.</StyledP>
          )}
        </Facilities>
        {playground.rating ? (
          <Rating>
            <p><strong>Rating:</strong> {playground.rating.toFixed(1)} / 5</p>
          </Rating>
        ) : (
          <StyledP>No ratings available.</StyledP>
        )}
        <ButtonContainer>
          <SaveButton onClick={savePlayground}>Save to Profile</SaveButton>
          <SaveButton onClick={handleGoToProfile}>Go to Profile ⇨</SaveButton>
        </ButtonContainer>
        {playground.geometry && (
          <Map>
            <iframe
              src={`https://www.google.com/maps?q=${playground.geometry.location.lat},${playground.geometry.location.lng}&z=15&output=embed`}
              width="600"
              height="450"
              title="Playground Location"
            ></iframe>
          </Map>
        )}
        {playground.reviews && playground.reviews.length > 0 ? (
          <Reviews>
            <h2>Reviews:</h2>
            {playground.reviews.map((review, index) => (
              <Review key={index}>
                <div>
                  <ReviewPhoto
                    src={review.profile_photo_url}
                    alt={`${review.author_name}'s profile`}
                    className="profile-photo"
                  />
                  <AuthorName href={review.author_url} target="_blank" rel="noopener noreferrer">
                    {review.author_name}
                  </AuthorName>
                </div>
                <div>Rating: {review.rating}</div>
                <ReviewText>{review.text}</ReviewText>
                <div>{review.relative_time_description}</div>
              </Review>
            ))}
          </Reviews>
        ) : (
          <StyledP>No reviews available.</StyledP>
        )}
      </div>
    </div>
  );
};