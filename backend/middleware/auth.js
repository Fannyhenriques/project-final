import { User } from "../models/user";
import jwt from 'jsonwebtoken';


//middleware for authentication
export const authenticateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ accessToken: req.header("Authorization") })
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ loggedOut: true, message: "Invalid access token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware to authenticate user using JWT
// export const authenticateUser = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", ""); // Get token from Authorization header

//   if (!token) {
//     return res.status(401).json({ loggedOut: true, message: "Access token is required" });
//   }
//   try {
//     // Verify and decode the JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // process.env.JWT_SECRET should be your secret key
//     // Find the user based on the decoded token
//     const user = await User.findById(decoded.userId); // Assuming userId is stored in the token
//     if (!user) {
//       return res.status(401).json({ loggedOut: true, message: "Invalid credentials" });
//     }
//     req.user = user; // Attach the user to the request object
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

