import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const LoginPage = () => {
  const { login, register, isLoading, error, isLoggedIn } = useUserStore();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Create the navigate function

  useEffect(() => {
    // Redirect to the profile page if the user is logged in
    if (isLoggedIn) {
      navigate("/profile"); // Adjust the path as needed
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
    <div>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login instead" : "Dont have an account? Register instead"}
      </button>
    </div>
  );
};



// export const LoginPage = () => {
//   const { login, register, isLoading, error } = useUserStore();
//   const [isRegister, setIsRegister] = useState(false); // Toggle between login and register
//   const [formData, setFormData] = useState({
//     nameOrEmail: "", // Used for login (name or email)
//     email: "",       // Used for register
//     name: "",        // Used for register
//     password: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const isEmail = (input) => {
//     const emailRegex = /\S+@\S+\.\S+/;
//     return emailRegex.test(input);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isRegister) {
//       // Registering a new user
//       await register(formData.name, formData.email, formData.password);
//     } else {
//       // Logging in with name or email
//       const loginIdentifier = formData.nameOrEmail;
//       await login(
//         isEmail(loginIdentifier) ? { email: loginIdentifier } : { name: loginIdentifier },
//         formData.password
//       );
//     }
//   };

//   return (
//     <div>
//       <div>
//         <h1>{isRegister ? "Register" : "Login"}</h1>

//         <form onSubmit={handleSubmit}>
//           {isRegister && (
//             <>
//               <div>
//                 <label htmlFor="name">Name</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter your name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </>
//           )}
//           {!isRegister && (
//             <div>
//               <label htmlFor="nameOrEmail">Name or Email</label>
//               <input
//                 type="text"
//                 id="nameOrEmail"
//                 name="nameOrEmail"
//                 value={formData.nameOrEmail}
//                 onChange={handleInputChange}
//                 placeholder="Enter your name or email"
//                 required
//               />
//             </div>
//           )}
//           <div>
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           {error && <p>{error}</p>}
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? "Loading..." : isRegister ? "Register" : "Login"}
//           </button>
//         </form>

//         <p>
//           {isRegister ? "Already have an account?" : "Don't have an account?"}
//           <button
//             type="button"
//             onClick={() => setIsRegister(!isRegister)}
//           >
//             {isRegister ? "Login" : "Register"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };