import express from "express";
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
