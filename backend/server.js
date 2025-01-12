import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-playground";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

const playgroundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [Number], //longitude, latitude
  },
  address: { type: String },
  source: { type: String, enum: ['Stockholm', 'Google'], required: true },
  facilities: [String], // ex. "Swings", "Slides" 
  images: [String], // URL
  ratings: { type: Number },
  googlePlaceId: { type: String },
});

//exporting named export for flexibility instead of default
export const Playground = mongoose.model('Playground', playgroundSchema);

app.get("/", (req, res) => {
  res.send("This is the playground app!");
});

// Route to fetch playground data from Google Places API 
app.get("/playgrounds", async (req, res) => {
  // Extracting query params 
  const { name, location } = req.query;

  let apiUrl = `${process.env.GOOGLE_PLACES_URL}?&key=${process.env.GOOGLE_API_KEY}`; // Initial URL, using let instead of contst to be able to reassign the value of the url using query params 

  // Query param for name - the playground name or the neighborhood name (ex. vasaparken or vasaparken playground)
  if (name) {
    apiUrl = `${process.env.GOOGLE_PLACES_URL}?query=playground+in+${name}&key=${process.env.GOOGLE_API_KEY}`;
    // apiUrl += `&query=${name}`;
  }
  if (location) { //This might not be nessecary unless we want to find an exact location using coordinates
    apiUrl = `${process.env.GOOGLE_PLACES_URL}?location=${location}&query=playground&key=${process.env.GOOGLE_API_KEY}`;
    // apiUrl += `&location=${location}`;
  }
  // Fetching data using axios
  try {
    const response = await axios.get(apiUrl);
    const playgrounds = response.data.results;

    if (playgrounds.length === 0) {
      res.status(404).json({ message: "Sorry - no playgrounds found" });
    } else {
      res.json(playgrounds); //getting the data for all playgrounds
    }
  } catch (error) {
    console.error("Error fetching data from the external API", error.message);
    res.status(500).send("Error fetching data from the external API", error.response?.data || error.message);
  }
});

// Fetching playground based on google places id 
app.get("/playgrounds/id/:place_id", async (req, res) => {
  const { place_id } = req.params; // Extracting place_id from URL params
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
    console.error("Error fetching data from the Google Places API", error.message);
    res.status(500).send("Error fetching data from the Google Places API");
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


//Query openstreetAPI

// [out:json][timeout:25];
// node["leisure"="playground"](59.0,17.5,60.2,19.0);
// out body;