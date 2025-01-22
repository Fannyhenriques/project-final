import express from "express";
import axios from "axios";
import { OverpassPlayground } from "../models/playground-overpassmodel";
import { GooglePlayground } from "../models/playground-googlemodel";
import { authenticateUser } from "../middleware/auth.js";

export const router = express.Router();

/** Function to fetch playgrounds from Overpass API */
async function fetchOverpassPlaygrounds(minLat, minLon, maxLat, maxLon) {
  const query = `
    [out:json][timeout:25];
    node["leisure"="playground"](${minLat},${minLon},${maxLat},${maxLon});
    out body;
  `;

  const url = `https://overpass-api.de/api/interpreter`;

  try {
    console.log("Query:", query);
    const response = await axios.post(
      url,
      `data=${encodeURIComponent(query)}`,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    console.log("Overpass response:", response.data);
    return response.data.elements;
  } catch (error) {
    console.error("Error fetching Overpass data:", error.message);
    throw new Error("Overpass API error");
  }
}

/** Function to fetch playground details from Google Maps API */
async function fetchGooglePlaceDetails(placeId) {
  const apiKey = process.env.GOOGLE_API_KEY; // Replace with your actual API key
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching Google place details:", error.message);
    throw new Error("Google API error");
  }
}

/** Transform Overpass data into a consistent format */
function transformOverpassData(playgrounds) {
  return playgrounds.map((place) => {
    // Ensure tags are handled correctly and provide a default empty object if missing
    const tags = place.tags || {};

    return {
      overpassId: place.id,
      name: tags.name || "Unknown Playground",
      description: tags.description || "",
      location: {
        type: "Point",
        coordinates: [place.lon, place.lat],
      },
      facilities: Object.keys(tags), //List all available tags as facilities
      source: "Overpass",
      tags: tags,
      type: place.type || "node", // Default to 'node' if not present
    };
  });
}

/** Route: Fetch playgrounds from Overpass API */
router.get("/", async (req, res) => {
  console.log("Playgrounds route was hit!");
  const { lat, lon } = req.query; // Get latitude and longitude from query params

  // Ensure latitude and longitude are provided
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  // Calculate bounding box around user location (e.g., 500 meters radius, adjust as needed)
  const radius = 0.009; // Approx. 1km radius in degrees, adjust as needed

  const minLat = parseFloat(lat) - radius;
  const maxLat = parseFloat(lat) + radius;
  const minLon = parseFloat(lon) - radius;
  const maxLon = parseFloat(lon) + radius;

  try {
    // Fetch playgrounds from Overpass API
    const playgrounds = await fetchOverpassPlaygrounds(
      minLat,
      minLon,
      maxLat,
      maxLon
    );
    const formattedPlaygrounds = transformOverpassData(playgrounds);

    // Save Overpass playgrounds to the Overpass model
    const overpassPlaygrounds = await OverpassPlayground.insertMany(
      formattedPlaygrounds
    );

    // Optionally, fetch additional playground details from Google API if needed
    const googlePlaygrounds = await GooglePlayground.find({
      location: {
        $geoWithin: {
          $box: [
            [minLon, minLat],
            [maxLon, maxLat],
          ],
        },
      },
    });

    // Combine both Overpass and Google data
    const allPlaygrounds = [...overpassPlaygrounds, ...googlePlaygrounds];

    res.json(allPlaygrounds);
  } catch (error) {
    console.error("Error fetching playground data:", error.message);
    res.status(500).json({ error: "Failed to fetch playground data" });
  }
});

/** Route: Fetch all playgrounds from both Overpass and Google models */
router.get("/all-playgrounds", async (req, res) => {
  try {
    // Fetch playgrounds from both Overpass and Google models
    const overpassPlaygrounds = await OverpassPlayground.find();
    const googlePlaygrounds = await GooglePlayground.find();

    // Combine the results from both sources
    const allPlaygrounds = [...overpassPlaygrounds, ...googlePlaygrounds];

    res.json(allPlaygrounds);
  } catch (error) {
    console.error("Error fetching all playgrounds:", error.message);
    res.status(500).json({ error: "Failed to fetch playgrounds" });
  }
});

/** Route: Fetch playground details by Overpass ID */
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Search for the playground in both Overpass and Google models
    let playground = await OverpassPlayground.findOne({ overpassId: id });

    if (!playground) {
      playground = await GooglePlayground.findOne({ googlePlaceId: id });
    }

    if (!playground) {
      return res.status(404).json({ message: "Playground not found" });
    }

    // Fetch additional details from Google Maps API (if applicable)
    if (playground.googlePlaceId) {
      const googleDetails = await fetchGooglePlaceDetails(
        playground.googlePlaceId
      );
      playground.googleDetails = googleDetails;
    }

    res.json(playground);
  } catch (error) {
    console.error("Error fetching playground details:", error.message);
    res.status(500).json({ error: "Failed to fetch playground details" });
  }
});

/** Route: Add a new playground to MongoDB */
router.post("/playgrounds", authenticateUser, async (req, res) => {
  const {
    name,
    description,
    address,
    facilities,
    images,
    location,
    googlePlaceId,
    source,
    overpassId,
  } = req.body;

  try {
    // Check if the playground already exists in the correct model
    const existingPlayground = await Playground.findOne({
      "location.coordinates": location.coordinates,
    });

    if (existingPlayground) {
      return res.status(400).json({ message: "Playground already exists" });
    }

    // Determine which model to use based on the source
    let newPlayground;
    if (source === "Overpass") {
      newPlayground = new OverpassPlayground({
        name,
        description,
        location,
        facilities,
        source,
        overpassId,
      });
    } else if (source === "Google") {
      newPlayground = new GooglePlayground({
        name,
        description,
        address,
        facilities,
        images,
        location,
        googlePlaceId,
        source,
      });
    } else {
      return res.status(400).json({ message: "Invalid source" });
    }

    // Save the playground to the appropriate model
    await newPlayground.save();
    res.status(201).json({ success: true, playground: newPlayground });
  } catch (error) {
    console.error("Error adding playground:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// import express from "express";
// import axios from "axios";
// import { OverpassPlayground } from "../models/playground-overpassmodel";
// import { GooglePlayground } from "../models/playground-googlemodel";
// import { authenticateUser } from "../middleware/auth.js";

// export const router = express.Router();

// /** Function to fetch playgrounds from Overpass API */
// async function fetchOverpassPlaygrounds() {
//   const query = `
//     [out:json][timeout:25];
//     node["leisure"="playground"](59.0,17.5,60.2,19.0);
//     out body;`;

//   const url = `https://overpass-api.de/api/interpreter`;

//   try {
//     const response = await axios.post(url, query, {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });
//     console.log("Overpass response:", response.data);
//     return response.data.elements;
//   } catch (error) {
//     console.error("Error fetching Overpass data:", error.message);
//     throw new Error("Overpass API error");
//   }
// }

// /** Function to fetch playground details from Google Maps API */
// async function fetchGooglePlaceDetails(placeId) {
//   const apiKey = process.env.GOOGLE_API_KEY; // Replace with your actual API key
//   const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     return response.data.result;
//   } catch (error) {
//     console.error("Error fetching Google place details:", error.message);
//     throw new Error("Google API error");
//   }
// }

// /** Transform Overpass data into a consistent format */
// function transformOverpassData(playgrounds) {
//   return playgrounds.map((place) => ({
//     overpassId: place.id,
//     name: place.tags?.name || "Unknown Playground",
//     description: place.tags?.description || "",
//     location: {
//       type: "Point",
//       coordinates: [place.lon, place.lat],
//     },
//     facilities: Object.keys(place.tags || {}),
//     source: "Overpass",
//   }));
// }

// /** Route: Fetch playgrounds from Overpass API */
// router.get("/", async (req, res) => {
//   console.log("Playgrounds route was hit!");
//   try {
//     const playgrounds = await fetchOverpassPlaygrounds();
//     const formattedPlaygrounds = transformOverpassData(playgrounds);

//     // Save Overpass playgrounds to the Overpass model
//     const overpassPlaygrounds = await OverpassPlayground.insertMany(
//       formattedPlaygrounds
//     );

//     res.json(overpassPlaygrounds);
//   } catch (error) {
//     console.error("Error fetching playground data:", error.message);
//     res.status(500).json({ error: "Failed to fetch playground data" });
//   }
// });

// /** Route: Fetch all playgrounds from both Overpass and Google models */
// router.get("/all-playgrounds", async (req, res) => {
//   try {
//     // Fetch playgrounds from both Overpass and Google models
//     const overpassPlaygrounds = await OverpassPlayground.find();
//     const googlePlaygrounds = await GooglePlayground.find();

//     // Combine the results from both sources
//     const allPlaygrounds = [...overpassPlaygrounds, ...googlePlaygrounds];

//     res.json(allPlaygrounds);
//   } catch (error) {
//     console.error("Error fetching all playgrounds:", error.message);
//     res.status(500).json({ error: "Failed to fetch playgrounds" });
//   }
// });

// /** Route: Fetch playground details by Overpass ID */
// router.get("/id/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Search for the playground in both Overpass and Google models
//     let playground = await OverpassPlayground.findOne({ overpassId: id });

//     if (!playground) {
//       playground = await GooglePlayground.findOne({ googlePlaceId: id });
//     }

//     if (!playground) {
//       return res.status(404).json({ message: "Playground not found" });
//     }

//     // Fetch additional details from Google Maps API (if applicable)
//     if (playground.googlePlaceId) {
//       const googleDetails = await fetchGooglePlaceDetails(
//         playground.googlePlaceId
//       );
//       playground.googleDetails = googleDetails;
//     }

//     res.json(playground);
//   } catch (error) {
//     console.error("Error fetching playground details:", error.message);
//     res.status(500).json({ error: "Failed to fetch playground details" });
//   }
// });

// /** Route: Add a new playground to MongoDB */
// router.post("/playgrounds", authenticateUser, async (req, res) => {
//   const {
//     name,
//     description,
//     address,
//     facilities,
//     images,
//     location,
//     googlePlaceId,
//     source,
//     overpassId,
//   } = req.body;

//   try {
//     // Check if the playground already exists in the correct model
//     const existingPlayground = await Playground.findOne({
//       "location.coordinates": location.coordinates,
//     });

//     if (existingPlayground) {
//       return res.status(400).json({ message: "Playground already exists" });
//     }

//     // Determine which model to use based on the source
//     let newPlayground;
//     if (source === "Overpass") {
//       newPlayground = new OverpassPlayground({
//         name,
//         description,
//         location,
//         facilities,
//         source,
//         overpassId,
//       });
//     } else if (source === "Google") {
//       newPlayground = new GooglePlayground({
//         name,
//         description,
//         address,
//         facilities,
//         images,
//         location,
//         googlePlaceId,
//         source,
//       });
//     } else {
//       return res.status(400).json({ message: "Invalid source" });
//     }

//     // Save the playground to the appropriate model
//     await newPlayground.save();
//     res.status(201).json({ success: true, playground: newPlayground });
//   } catch (error) {
//     console.error("Error adding playground:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// export const router = express.Router();

// // Helper function to query Google Places API by coordinates and radius (with fallback handling)
// export async function fetchGooglePlacesPlaygrounds(
//   lat,
//   lng,
//   radius = process.env.DEFAULT_RADIUS
// ) {
//   const coordinates =
//     lat && lng ? `${lat},${lng}` : process.env.STOCKHOLM_COORDINATES;

//   const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates}&radius=${radius}&keyword=playground&key=${process.env.GOOGLE_API_KEY}`;

//   try {
//     const response = await axios.get(apiUrl);
//     console.log("Google API response:", response.data); // Log full response for debugging
//     return response.data.results || [];
//   } catch (error) {
//     console.error("Error fetching from Google Places API:", error.message);
//     throw new Error("Google Places API error");
//   }
// }

// // Helper function to query Google Places API by name (optional for name-based search)
// export async function fetchGooglePlacesPlaygroundsByName(
//   name,
//   radius = process.env.DEFAULT_RADIUS
// ) {
//   const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
//     name
//   )}+playground&radius=${radius}&key=${process.env.GOOGLE_API_KEY}`;

//   try {
//     const response = await axios.get(apiUrl);
//     return response.data.results || [];
//   } catch (error) {
//     console.error("Error fetching from Google Places API:", error.message);
//     throw new Error("Google Places API error");
//   }
// }

// // New route to get playgrounds by fallback coordinates, specific coordinates, or name
// router.get("/", async (req, res) => {
//   let { lat, lng, radius = 2000, name } = req.query;

//   console.log("Received Coordinates:", lat, lng);
//   console.log("Received Radius:", radius);

//   // Fallback to default coordinates if no lat/lng are provided
//   if (!lat || !lng) {
//     console.log("Latitude or longitude missing, using fallback coordinates.");
//     lat = process.env.STOCKHOLM_COORDINATES.split(",")[0];
//     lng = process.env.STOCKHOLM_COORDINATES.split(",")[1];
//   }

//   try {
//     let playgrounds = [];

//     // Fetch by name if provided
//     if (name) {
//       console.log("Searching for playgrounds by name:", name);
//       playgrounds = await fetchGooglePlacesPlaygroundsByName(name, radius);
//     } else {
//       // Fetch by coordinates if no name is provided
//       console.log("Searching for nearby playgrounds by coordinates.");
//       playgrounds = await fetchGooglePlacesPlaygrounds(lat, lng, radius);
//     }

//     // If no results were found, fall back to default location
//     if (playgrounds.length === 0) {
//       console.log("No playgrounds found, using fallback.");
//       playgrounds = await fetchGooglePlacesPlaygrounds(
//         process.env.STOCKHOLM_COORDINATES.split(",")[0],
//         process.env.STOCKHOLM_COORDINATES.split(",")[1],
//         radius
//       );
//     }

//     // Process the fetched playground data
//     const processedPlaygrounds = playgrounds.map((place) => {
//       const { geometry, name, vicinity, types, place_id, rating } = place;
//       return {
//         name,
//         description: "", // Placeholder description
//         address: vicinity || "",
//         source: "Google",
//         facilities: types || [],
//         ratings: [rating || 1],
//         googlePlaceId: place_id,
//         location: {
//           type: "Point",
//           coordinates: [geometry.location.lng, geometry.location.lat],
//         },
//       };
//     });

//     // Check for duplicates before saving
//     const existingIds = await Playground.find({
//       googlePlaceId: { $in: processedPlaygrounds.map((p) => p.googlePlaceId) },
//     }).select("googlePlaceId");

//     const newPlaygrounds = processedPlaygrounds.filter(
//       (p) => !existingIds.some((e) => e.googlePlaceId === p.googlePlaceId)
//     );

//     if (newPlaygrounds.length) {
//       // Save new playgrounds to the database
//       await Playground.insertMany(newPlaygrounds);
//       console.log("Playgrounds saved:", newPlaygrounds);
//     } else {
//       console.log("No new playgrounds to save.");
//     }

//     return res.json(newPlaygrounds); // Return the processed playgrounds
//   } catch (error) {
//     console.error("Error fetching playground data:", error);
//     res.status(500).json({ error: "Failed to fetch playground data" });
//   }
// });

// // Fetch playground details by Google Place ID
// router.get("/id/:place_id", async (req, res) => {
//   const { place_id } = req.params;
//   const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.GOOGLE_API_KEY}`;

//   try {
//     const response = await axios.get(apiUrl);
//     const playgroundDetails = response.data.result;

//     if (!playgroundDetails) {
//       res.status(404).json({ message: "Playground not found" });
//     } else {
//       res.json(playgroundDetails);
//     }
//   } catch (error) {
//     console.error("Error fetching from Google Places API:", error.message);
//     res.status(500).send("Error fetching from Google Places API");
//   }
// });

// // Route to create a new playground entry
// router.post("/", authenticateUser, async (req, res) => {
//   const { name, description, address, facilities, images, location } = req.body;

//   // Validate location (coordinates required, fallback if missing)
//   const validLocation =
//     location &&
//     Array.isArray(location.coordinates) &&
//     location.coordinates.length === 2
//       ? location
//       : { type: "Point", coordinates: [0, 0] };

//   try {
//     const newPlayground = new Playground({
//       name,
//       description,
//       address,
//       facilities,
//       images,
//       location: validLocation,
//       postedBy: req.user._id,
//     });

//     await newPlayground.save();
//     res.status(201).json({
//       success: true,
//       message: "Playground created successfully",
//       playground: newPlayground,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Internal server error", error });
//   }
// });

// // Route to rate a playground
// router.patch("/rate", async (req, res) => {
//   try {
//     const { googlePlaceId, playgroundId, rating } = req.body;

//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({ error: "Rating must be between 1 and 5" });
//     }

//     const playground = await Playground.findOne({
//       $or: [{ googlePlaceId }, { _id: playgroundId }],
//     });

//     if (!playground) {
//       return res.status(404).json({ error: "Playground not found" });
//     }

//     // Update rating and calculate average
//     playground.ratings.push(rating);
//     const averageRating =
//       playground.ratings.reduce((a, b) => a + b) / playground.ratings.length;
//     playground.ratings = averageRating;

//     await playground.save();
//     res.status(200).json(playground);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error updating playground rating" });
//   }
// });

// // 59.5114531 / 18.0824075
// // http://localhost:9000/api/playgrounds?lat=59.5114531&lng=18.0824075
