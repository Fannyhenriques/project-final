import bcrypt from "bcrypt-nodejs";
import express from "express";
import { User } from "../models/user";
import { authenticateUser } from "../middleware/auth.js";

export const router = express.Router();

// route to register as a user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password: bcrypt.hashSync(password) });
    await user.save();
    res.status(201).json({
      id: user._id,
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
        id: user._id,
        name: user.name,
        email: user.email,
        savedPlaygrounds: user.savedPlaygrounds,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile", error });
  }
});