import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  display: grid;
  text-align: center;
`;

const Heading1 = styled.h1`
  color: white;
`;

const Heading2 = styled.h2`
  color: white;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin: 10px 0;

  &:hover {
    background-color: #45a049;
  }
`;

const List = styled.ul`
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  height: 100px;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  max-width: 300px;
  height: 200px;
  border: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
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

  const [postedPlaygrounds, setPostedPlaygrounds] = useState([]); // Store multiple posted playgrounds

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
    logout(); // Performs the logout logic
    navigate("/login"); // Redirects to login page when logout button is clicked
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

    // Add the new playground to the list of posted playgrounds
    setPostedPlaygrounds((prev) => [...prev, newPlayground]);

    // Reset form after posting
    setNewPlayground({
      name: '',
      address: '',
      location: { coordinates: [0, 0] },
    });
  };

  const handleRemovePlayground = async (playgroundToRemove) => {
    try {
      // Call the zustand action to remove the playground from the backend and store
      await removePlayground(playgroundToRemove);

      // After the playground is removed from the store, update the savedPlaygrounds in the profile state
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
          <TextArea
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