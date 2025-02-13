import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { routes } from "../utils/routes";
import styled from "styled-components";
import { Text, PageTitle, SubPageTitle, primaryFont } from "../ui/Typography";

const Container = styled.div`
  padding: 20px;
  padding-top: 2rem;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center; 
  text-align: center;
  margin: 0 auto;
`;

const Heading1 = styled(PageTitle)`
  padding-bottom: 1rem;
  color: white;
`;

const Heading2 = styled(SubPageTitle)`
  color: white;
  padding-top: 4rem;
  padding-bottom: 1rem;
  margin: 0;
`;

const Button = styled.button`
  width: 50%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  color: #2f3e46;
  &:hover {
    background-color: #3c6e71;
    color: white; 
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

    @media (min-width: 1250px) {
    width: 300px; 
  }
`;

const SavedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);  
  gap: 1rem;  
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {  
    grid-template-columns: repeat(2, 1fr);  
  }

  @media (max-width: 480px) {  
    grid-template-columns: 1fr;  
  }
`;

const NoPlaygroundsText = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto; 
  text-align: center;
  padding: 2rem 0;
`;

const ContainerButton = styled.button`
  max-width: 80%;
  padding: 0.6rem;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  align-self: center;
  cursor: pointer;
  background-color: white;
  color: #2f3e46;
  &:hover {
    background-color: #2f3e46;
    color: white; 
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  max-width: 80%;
  padding: 0.6rem;
  margin-top: 1rem;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  align-self: center;
  cursor: pointer;
  background-color: white;
  color: #2f3e46;
  &:hover {
    background-color: #3c6e71;
    color: white; 
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  @media (max-width: 480px) {
  font-size: 14px;
  }
`;

const RemovePostButton = styled.button`
  max-width: 80%;
  padding: 0.6rem;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  align-self: center;
  cursor: pointer;
  background-color: white;
  color: #2f3e46;
  &:hover {
    background-color: #3c6e71;
    color: white; 
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const List = styled.ul`
  display: contents;
  background-color: red;
  max-width: 100%;
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled(Text)`
  max-width: 100%;
  padding: 15px;
`;

const LogoutText = styled(Text)`
  font-family: ${primaryFont};
  text-align: center;
  font-size: 1.2rem;
  padding-top: 2rem; 
`;

const Paragraph = styled(Text)`
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #3c6e71; 
  border-radius: 15px; 
  padding: 20px;
  width: 300px;
  margin: 0 auto;
  gap: 0.3rem;

  @media (max-width: 480px) {
  width: 250px; 
  margin: 0 auto; 
  }

  @media (max-width: 330px) {
  width: 90%; 
  padding: 15px; 
  margin: 0 auto; 
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled(Text)`
  display: block;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  padding: 0;
  margin: 0;
  margin-bottom: 0.2rem;
`;

const Input = styled.input`
  width: 250px;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const StyledIframe = styled.iframe`
  width: 100%;
  max-width: 300px;
  height: 200px;
  border: none;
`;

export const ProfilePage = () => {
  const { user, fetchUserProfile, logout, isLoading, error, postPlayground, removePlayground } = useUserStore();
  const navigate = useNavigate();

  const [newPlayground, setNewPlayground] = useState({
    name: '',
    description: '',
    address: '',
    facilities: '',
    images: '',
    location: { coordinates: [0, 0] },
  });

  const [postedPlaygrounds, setPostedPlaygrounds] = useState([]);

  useEffect(() => {
  }, [user?.savedPlaygrounds]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={fetchUserProfile}>Retry</button>
      </div>
    );
  }
  if (!user) {
    return <LogoutText>Oops! It looks like you're not logged in. <br></br> Please <Link to={routes.login}>login</Link> or register to access your profile page.</LogoutText>;
  }


  // if (isFetchingData) {

  //   return (
  //     <LoaderContainer>
  //       <StyledText>Loading Playground Map...</StyledText>
  //       <Lottie animationData={loadingAnimation} loop={true} />
  //     </LoaderContainer>
  //   );
  // }


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayground((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePostPlayground = async (e) => {
    e.preventDefault();
    await postPlayground(newPlayground);

    setPostedPlaygrounds((prev) => [...prev, newPlayground]);

    setNewPlayground({
      name: '',
      address: '',
      location: { coordinates: [0, 0] },
    });
  };

  const handleRemovePlayground = async (playgroundToRemove) => {
    try {
      await removePlayground(playgroundToRemove);

      setPostedPlaygrounds((prev) => prev.filter(pg => pg.id !== playgroundToRemove.id));
    } catch (err) {
      console.error("Error removing playground:", err.message);
    }
  };

  return (
    <Container>
      <div>
        <Heading1>Welcome, {user.name}</Heading1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <Heading2>Your saved Playgrounds:</Heading2>
      {Array.isArray(user?.savedPlaygrounds) && user.savedPlaygrounds.length > 0 ? (
        <SavedContainer>
          {user.savedPlaygrounds.map((pg) => (
            <ListItem key={pg._id}>
              <Paragraph>{pg.name}</Paragraph>
              <div>
                <StyledIframe
                  src={`https://www.google.com/maps?q=${pg.location.coordinates[0]},${pg.location.coordinates[1]}&z=15&output=embed`}
                  title="Playground Location"
                ></StyledIframe>
              </div>
              {/* <Paragraph>
                <a href={`/playgrounds/${pg._id}`}>Go to playground</a>
              </Paragraph> */}
              <RemoveButton onClick={() => handleRemovePlayground(pg)}>
                Remove from favourites
              </RemoveButton>
            </ListItem>
          ))}
        </SavedContainer>
      ) : (
        <NoPlaygroundsText>You have no saved playgrounds yet. Add some!</NoPlaygroundsText>
      )}

      <Heading2>Add a New Playground:</Heading2>
      <Form onSubmit={handlePostPlayground}>
        <FormGroup>
          <Label>Name of playground:</Label>
          <Input
            type="text"
            name="name"
            value={newPlayground.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Description:</Label>
          <Input
            name="description"
            value={newPlayground.description}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Address:</Label>
          <Input
            type="text"
            name="address"
            value={newPlayground.address}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Facilities:</Label>
          <Input
            type="text"
            name="facilities"
            value={newPlayground.facilities}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Images (optional):</Label>
          <Input
            type="text"
            name="images"
            value={newPlayground.images}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Location Coordinates (optional):</Label>
          <Input
            type="text"
            name="location"
            value={
              newPlayground.location?.coordinates?.join(", ") || ""
            }
            onChange={(e) =>
              setNewPlayground((prev) => ({
                ...prev,
                location: {
                  coordinates: e.target.value
                    .split(",")
                    .map((coord) => Number(coord.trim())),
                },
              }))
            }
          />
        </FormGroup>
        <ContainerButton type="submit">Post Playground</ContainerButton>
      </Form>

      <Heading2>Your Posted Playgrounds:</Heading2>
      {postedPlaygrounds.length > 0 ? (
        <List>
          {postedPlaygrounds.map((playground, index) => (
            <ListItem key={index}>
              <p><strong>Name:</strong> {playground.name}</p>
              <p><strong>Description:</strong> {playground.description}</p>
              <p><strong>Address:</strong> {playground.address}</p>
              <p><strong>Facilities:</strong> {playground.facilities}</p>
              <p><strong>Location:</strong> {playground.location.coordinates.join(", ")}</p>
              <RemovePostButton onClick={() => handleRemovePlayground(playground)}>
                Remove Playground
              </RemovePostButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Paragraph>You have not posted any playgrounds yet.</Paragraph>
      )}
    </Container>
  );
};