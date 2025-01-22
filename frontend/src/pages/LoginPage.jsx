import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      const response = await fetch("/api/register", {
        method: "POST",
      });
      if (response.ok) {
        alert("Registration successful!");
        setIsRegister(false);
      }
    } else {
      const response = await fetch("/api/login", {
        method: "POST",
      });
      if (response.ok) {
        alert("Login successful!");
        navigate("/profile");
      }
    }
  }
};

return (
  <div>
    <h1>{isRegister ? "Register" : "Login"}</h1>
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      {isRegister && <input type="text" placeholder="Username" required />}
      <button type="submit">{isRegister ? "Register" : "Login"}</button>
    </form>
    <button onClick={() => setIsRegister(!isRegister)}>
      {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
    </button>
  </div>
);
