import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PageTitle, Text } from "../ui/Typography";
import Children from "../assets/Children.png";

const StyledPageTitle = styled(PageTitle)`
  padding-top: 30px; 
`;

const Img = styled.img`
  right: 100px;
  width: 20rem;
  height: auto;
  padding-top: 5px;

  @media (max-width: 768px) {
    width: 14rem;
    margin: 0 auto;
    justify-content: center; 
    display: block;
    padding: 0px 10px 0px 10px;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

@media (max-width: 480px) {
  max-width: 300px;
}
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 12px;
  background: #315a5c; 
  border-radius: 15px; 
  padding: 20px; 

  @media (max-width: 480px) {
  width: 90%;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled(Text)`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none; 

  &:focus {
    border-color: #7eb7bd;
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Roboto";
  background-color: white;
  color: #2f3e46;
  &:hover {
    background-color: #E6FA54;
    color: #2f3e46; 
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled(Button)`
  background-color: transparent;
  color: white;
  font-family: "Roboto";
  text-decoration: underline;

  &:hover {
   background: transparent;  
   color: #E6FA54; 
  }
`;

export const LoginPage = () => {
  const { login, register, isLoading, error, isLoggedIn } = useUserStore();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await register(formData.name, formData.email, formData.password);
    } else {
      await login(formData.email, formData.password);
    }
  };

  return (
    <FormContainer>
      <StyledPageTitle>{isRegister ? "Register" : "Login"}</StyledPageTitle>
      <StyledForm onSubmit={handleSubmit}>
        {isRegister && (
          <InputGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </InputGroup>
        )}
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </InputGroup>
        {error && <Text color="red">{error}</Text>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : isRegister ? "Register" : "Login"}
        </Button>
      </StyledForm>

      <ToggleButton onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login instead" : "Don't have an account? Register instead"}
      </ToggleButton>
      <Img src={Children} alt="playground-image" />
    </FormContainer>
  );
};
