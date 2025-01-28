import bcrypt from "bcrypt-nodejs";
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { authenticateUser } from "../middleware/auth.js";

export const router = express.Router();

// route to register as a user
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is already in use",
//       });
//     }
//     // Hash password
//     const hashedPassword = bcrypt.hashSync(password);

//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h", // Set token expiration time (1 hour)
//     });

//     res.status(201).json({
//       success: true,
//       userId: user._id,
//       token, // Send the JWT token
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(400).json({
//         success: false,
//         message: "Email already exists",
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Failed to register user",
//         error: error.message,
//       });
//     }
//   }
// });
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password: bcrypt.hashSync(password) });
    await user.save();
    res.status(201).json({
      userId: user._id,
      accessToken: user.accessToken,
      message: "User registered successfully",
    });
  } catch (error) { //added 11000 error for when the user or email already is registrerd. 
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Name or email already exists",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to register user",
        error: error.message,
      });
    }
  }
});

//route for login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Check if password matches
//     const passwordMatch = bcrypt.compareSync(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h", // Set token expiration time (1 hour)
//     });

//     res.status(200).json({
//       success: true,
//       userId: user._id,
//       token, // Send the JWT token
//       message: "Logged in successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });
router.post("/login", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ name }, { email: email.toLowerCase().trim() }], // $or - make it possible to use both name or email
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        userId: user._id,
        accessToken: user.accessToken,
        message: "Logged in successfully",
      });
    } else {
      res.status(401).json({
        success: false,
        notFound: true,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// a possible route for profilepage
// router.get("/profile", authenticateUser, async (req, res) => {
//   try {
//     // The authenticated user is already attached to `req.user`
//     const user = await User.findById(req.user._id).populate("savedPlaygrounds");

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         savedPlaygrounds: user.savedPlaygrounds,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching profile", error });
//   }
// });
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    // Fetch the user by ID, populating saved playgrounds
    const user = await User.findById(req.user.id).populate("savedPlaygrounds");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        savedPlaygrounds: user.savedPlaygrounds,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile", error });
  }
});