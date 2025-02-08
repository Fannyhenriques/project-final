import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Text, PageTitle, SubPageTitle, primaryFont } from "../ui/Typography";

const Container = styled.div`
  padding: 20px;
  padding-top: 2rem;
  width: 80%;
  display: grid;
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
  width: 30%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  color: #053332;
  &:hover {
    background-color: #3c6e71;
    color: white; 
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SavedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const NoPlaygroundsText = styled(Text)`
  grid-column: span 3;
`;

const ContainerButton = styled.button`
  max-width: 100%;
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
    background-color: #2f3e46;
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

const ListItem = styled.li`
  max-width: 100%;
  /* margin: 10px 0; */
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
  background: #446569; 
  border-radius: 15px; 
  padding: 20px;
  width: 300px;
  margin: 0 auto;
  gap: 0.3rem;

  @media (max-width: 480px) {
    width: 250px;
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
    console.log("Profile updated, savedPlaygrounds:", user?.savedPlaygrounds);
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
    return <LogoutText>Oops! It looks like you're not logged in. <br></br> Please log in or register to access your profile page.</LogoutText>;
  }

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

  console.log('User Data:', user);
  console.log("Saved Playgrounds in Profile Component:", user?.savedPlaygrounds);

  return (
    <Container>
      <div>
        <Heading1>Welcome, {user.name}</Heading1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <Heading2>Your saved Playgrounds:</Heading2>
      <SavedContainer>
        {Array.isArray(user?.savedPlaygrounds) && user.savedPlaygrounds.length > 0 ? (
          <List>
            {user.savedPlaygrounds.map((pg) => (
              <ListItem key={pg._id}>
                <Paragraph>{pg.name}</Paragraph>
                <div>
                  <StyledIframe
                    src={`https://www.google.com/maps?q=${pg.location.coordinates[0]},${pg.location.coordinates[1]}&z=15&output=embed`}
                    title="Playground Location"
                  ></StyledIframe>
                </div>
                <Paragraph>
                  <a href={`/details/${pg._id}`}>Go to playground</a>
                </Paragraph>
                <ContainerButton onClick={() => handleRemovePlayground(pg)}>
                  Remove from favourites
                </ContainerButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <NoPlaygroundsText>You have no saved playgrounds yet. Add some!</NoPlaygroundsText>
        )}
      </SavedContainer>

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
              <ContainerButton onClick={() => handleRemovePlayground(playground)}>
                Remove Playground
              </ContainerButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Paragraph>You have not posted any playgrounds yet.</Paragraph>
      )}
    </Container>
  );
};