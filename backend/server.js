import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcrypt-nodejs"

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-playground";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

//SCHEMA AND MODELS
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
  source: { type: String, enum: ['Stockholm', 'Google'] },
  facilities: [String], // ex. "Swings", "Slides" 
  images: [String], // URL
  ratings: { type: Number },
  googlePlaceId: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

//exporting named export for flexibility instead of default
export const Playground = mongoose.model('Playground', playgroundSchema);

const User = mongoose.model("User", {
  name: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  }
});

//middleware for authentication
const authenticateUser = async (req, res, next) => {
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

//GET-ROUTES
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
  }
  // changed to postal code?
  if (location) {
    const [lat, lng] = location.split(',').map(coord => coord.trim());
    const radius = 100;
    // Constructing the API URL with location and radius
    apiUrl = `${process.env.GOOGLE_PLACES_URL}?location=${lat},${lng}&radius=${radius}&types=playground&key=${process.env.GOOGLE_API_KEY}`;
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

//ROUTES TO REGISTER, LOGIN AND POST

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password: bcrypt.hashSync(password) });
    await user.save();
    res.status(201).json({
      id: user._id,
      accessToken: user.accessToken,
      message: "User registered successfully"
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
      $or: [{ name }, { email }]  // $or - make it possible to use both name or email 
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        userId: user._id,
        accessToken: user.accessToken,
        message: "Logged in successfully"
      });
    } else {
      res.status(401).json({
        success: false,
        notFound: true,
        message: "Invalid credentials"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});


//route to post a playground
app.post("/playgrounds", authenticateUser, async (req, res) => {
  const { name, description, address, facilities, images } = req.body;

  try {
    const newPlayground = new Playground({
      name,
      description,
      address,
      facilities,
      images,
      postedBy: req.user._id
    });
    await newPlayground.save();
    res.status(201).json({ success: true, message: "Playground created successfully", playground: newPlayground });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error });
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