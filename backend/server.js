import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
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
      type: String, // GeoJSON type
      default: "Point",
    },
    coordinates: [Number], // [longitude, latitude]
  },
  address: { type: String },
  source: { type: String, enum: ['Stockholm', 'Google'], required: true },
  facilities: [String], // e.g., ["Swings", "Slides"]
  images: [String], // URLs for images
  ratings: { type: Number }, // From Google Places
  googlePlaceId: { type: String }, // Optional for Google data
});

module.exports = mongoose.model('Playground', playgroundSchema);

//Installera axios/fetch 
//

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// const mongoose = require('mongoose');

// const playgroundSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   location: {
//     type: {
//       type: String, // GeoJSON type
//       default: "Point",
//     },
//     coordinates: [Number], // [longitude, latitude]
//   },
//   address: { type: String },
//   source: { type: String, enum: ['Stockholm', 'Google'], required: true },
//   facilities: [String], // e.g., ["Swings", "Slides"]
//   images: [String], // URLs for images
//   ratings: { type: Number }, // From Google Places
//   googlePlaceId: { type: String }, // Optional for Google data
// });

// module.exports = mongoose.model('Playground', playgroundSchema);