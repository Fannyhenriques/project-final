import express from "express";
import authenticateUser from "../middleware/auth"; // Import the middleware
import Playground from "./models/playground.js";

const app = express();

// Get all playgrounds
app.get("/api/playgrounds", async (req, res) => {
  try {
    const playgrounds = await Playground.find();
    res.json(playgrounds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving playgrounds" });
  }
});

// Get playgrounds near a given location
app.get("/api/playgrounds/near", async (req, res) => {
  try {
    const { lat, lon, maxDistance = 5000 } = req.query; // Default to 5 km radius
    const coordinates = [lon, lat]; // Ensure that coordinates are in [longitude, latitude] order

    const playgrounds = await Playground.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates },
          $maxDistance: maxDistance,
        },
      },
    });
    res.json(playgrounds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error finding nearby playgrounds" });
  }
});

// Get a specific playground by ID
app.get("/api/playgrounds/:id", async (req, res) => {
  try {
    const playground = await Playground.findById(req.params.id);
    if (!playground) {
      return res.status(404).json({ error: "Playground not found" });
    }
    res.json(playground);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving playground" });
  }
});

// route to register as a user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password: bcrypt.hashSync(password) });
    await user.save();
    res.status(201).json({
      id: user._id,
      accessToken: user.accessToken,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
});

//route for login
app.post("/login", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ name }, { email }], // $or - make it possible to use both name or email
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

module.exports = app;

// Create a new playground
// app.post("/api/playgrounds", async (req, res) => {
//   try {
//     const { name, address, source, facilities, images, ratings, googlePlaceId, postedBy, coordinates } = req.body;

//     // Create a new playground document
//     const newPlayground = new Playground({
//       name,
//       address,
//       source,
//       facilities,
//       images,
//       ratings,
//       googlePlaceId,
//       postedBy,
//       location: {
//         type: 'Point',
//         coordinates: coordinates // expects [longitude, latitude]
//       }
//     });

// Save the playground to the database
//     const savedPlayground = await newPlayground.save();
//     res.status(201).json(savedPlayground);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error creating playground" });
//   }
// });
