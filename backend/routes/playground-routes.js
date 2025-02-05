import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import { authenticateUser } from "../middleware/auth.js";
import { Playground } from "../models/playground.js";

export const router = express.Router();

// Helper function to query Google Places API 
export async function fetchGooglePlacesPlaygrounds(
  lat,
  lng,
  radius = process.env.DEFAULT_RADIUS
) {
  const coordinates =
    lat && lng ? `${lat},${lng}` : process.env.STOCKHOLM_COORDINATES;

  //constructing the api dynamicly with the 
  const apiUrl = process.env.GOOGLE_PLACES_URL.replace(
    "{LAT}",
    coordinates.split(",")[0]
  )
    .replace("{LNG}", coordinates.split(",")[1])
    .replace("{RADIUS}", radius);

  try {
    const response = await axios.get(apiUrl, {
      params: { key: process.env.GOOGLE_API_KEY },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching from Google Places API:", error.message);
    throw new Error("Google Places API error");
  }
}

//helper function to query by name using textsearch 
export async function fetchGooglePlacesPlaygroundsByName(name, radius = process.env.DEFAULT_RADIUS) {
  const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(name)}+playground&radius=${radius}&key=${process.env.GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching from Google Places API:", error.message);
    throw new Error("Google Places API error");
  }
}

//new route to get playgrounds by fallback coordinates, specific coordinates or name
router.get("/", async (req, res) => {
  let { lat, lng, radius = 5000, name } = req.query;

  console.log("Received Coordinates:", lat, lng);

  if (!lat || !lng) {
    console.log("Latitude or longitude missing, using fallback coordinates.");
    lat = process.env.STOCKHOLM_COORDINATES.split(",")[0];
    lng = process.env.STOCKHOLM_COORDINATES.split(",")[1];
  }

  try {
    let playgrounds = [];

    if (name) {
      // If a name is provided, search for playgrounds by name
      console.log("Searching for playgrounds by name:", name);
      playgrounds = await fetchGooglePlacesPlaygroundsByName(name, radius);
    } else {
      // If no name is provided, fetch playgrounds based on coordinates
      console.log("Searching for nearby playgrounds by coordinates.");
      playgrounds = await fetchGooglePlacesPlaygrounds(lat, lng, radius);
    }

    if (playgrounds.length === 0) {
      console.log("No playgrounds found, using fallback.");
      const fallbackPlaygrounds = await fetchGooglePlacesPlaygrounds(
        process.env.STOCKHOLM_COORDINATES.split(",")[0],
        process.env.STOCKHOLM_COORDINATES.split(",")[1],
        radius
      );
      return res.json(fallbackPlaygrounds);
    } else {
      // Process playground data to match MongoDB schema
      const processedPlaygrounds = playgrounds.map((place) => {
        const { geometry } = place;
        const location = {
          type: "Point",
          coordinates: [geometry.location.lng, geometry.location.lat],
        };

        return {
          name: place.name,
          description: place.description || "",
          address: place.vicinity || "",
          source: "Google",
          facilities: place.types || [],
          ratings: place.rating || 1,
          googlePlaceId: place.place_id,
          location,
        };
      });

      // Saving playgrounds to the database
      const savedPlaygrounds = await Playground.insertMany(processedPlaygrounds);

      return res.json(savedPlaygrounds);
    }
  } catch (error) {
    console.error("Error fetching playground data:", error);
    res.status(500).json({ error: "Failed to fetch playground data" });
  }
});

//and then here we have the route that we are using to retrieve details about the specific playground, so when you click on a playground this route will be used and display images, description and so on... 
router.get("/id/:place_id", async (req, res) => {
  const { place_id } = req.params;
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(apiUrl);
    const playgroundDetails = response.data.result;
    if (!playgroundDetails) {
      res.status(404).json({ message: "Playground not found" });
    } else {
      res.json(playgroundDetails);
    }
  } catch (error) {
    console.error("Error fetching from Google Places API:", error.message);
    res.status(500).send("Error fetching from Google Places API");
  }
});

router.post("/", authenticateUser, async (req, res) => {
  const { name, description, address, facilities, images, location } = req.body;
  const validLocation = location && Array.isArray(location.coordinates) && location.coordinates.length === 2
    ? location
    : { type: "Point", coordinates: [0, 0] };
  try {
    const newPlayground = new Playground({
      name,
      description,
      address,
      facilities,
      images,
      location: validLocation,
      postedBy: req.user._id,
    });
    await newPlayground.save();
    res.status(201).json({
      success: true,
      message: "Playground created successfully",
      playground: newPlayground,
    });
    await newPlayground.save();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
});

router.patch('/rate', async (req, res) => {
  try {
    const { googlePlaceId, playgroundId, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Building the query dynamically
    const query = { $or: [{ googlePlaceId }] };

    if (mongoose.Types.ObjectId.isValid(playgroundId)) {
      query.$or.push({ _id: new mongoose.Types.ObjectId(playgroundId) });
    }

    const playground = await Playground.findOne(query);
    if (!playground) {
      return res.status(404).json({ error: "Playground not found" });
    }

    // Updates the ratings
    playground.ratings.push(rating);
    const averageRating =
      playground.ratings.reduce((a, b) => a + b, 0) / playground.ratings.length;
    playground.ratings = averageRating;

    await playground.save();

    res.status(200).json(playground);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating playground rating" });
  }
});
