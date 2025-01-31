import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Text, PageTitle, SubPageTitle } from "../ui/Typography";

const Container = styled.div`
  padding: 20px;
  width: 50%;
  display: grid;
  text-align: center;
  margin: 0 auto;
`;

const Heading1 = styled(PageTitle)`
  color: white;
`;

const Heading2 = styled(SubPageTitle)`
  color: white;
`;

const Button = styled.button`
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

const List = styled(Text)`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #666;
`;

const Form = styled.form`
  margin-top: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
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
    return <p>Oops! It looks like you're not logged in. <br></br> Please log in or register to access your profile page.</p>;
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
      <Heading1>Welcome, {user.name}</Heading1>
      <Button onClick={handleLogout}>Logout</Button>

      <Heading2>Your saved Playgrounds:</Heading2>
      {Array.isArray(user?.savedPlaygrounds) && user.savedPlaygrounds.length > 0 ? (
        <List>
          {user.savedPlaygrounds.map((pg) => (
            <ListItem key={pg._id}>
              <h3>{pg.name}</h3>
              <div>
                <StyledIframe
                  src={`https://www.google.com/maps?q=${pg.location.coordinates[0]},${pg.location.coordinates[1]}&z=15&output=embed`}
                  title="Playground Location"
                ></StyledIframe>
              </div>
              <Paragraph>
                <a href={`/details/${pg._id}`}>Go to playground</a>
              </Paragraph>
              <Button onClick={() => handleRemovePlayground(pg)}>
                Remove from favourites
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Paragraph>You have no saved playgrounds yet. Add some!</Paragraph>
      )}

      <Heading2>Add a New Playground:</Heading2>
      <Form onSubmit={handlePostPlayground}>
        <FormGroup>
          <Label>Name:</Label>
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
        <Button type="submit">Post Playground</Button>
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
              <Button onClick={() => handleRemovePlayground(playground)}>
                Remove Playground
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Paragraph>No playgrounds posted yet.</Paragraph>
      )}
    </Container>
  );
};