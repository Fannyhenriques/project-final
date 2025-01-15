import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/playground-routes";

dotenv.config();

// const mongoUrl = process.env.{MONGO_URL}{API_URL} || "mongodb://localhost/thoughts";

// Google Places API URL (with placeholders)
// const googlePlacesBaseUrl = process.env.GOOGLE_PLACES_URL;
// const apiKey = process.env.GOOGLE_API_KEY;

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-playground";
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("Error connecting to MongoDB Atlas:", err));
if (!mongoUrl) {
  throw new Error("MONGO_URL is not defined"); // This will crash the app
}

// Connect to MongoDB
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.log('Error connecting to MongoDB Atlas:', err));

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

// This will prefix all the routes in playgroundRoutes with /api/playgrounds
app.use("/api/playgrounds", router);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//Query openstreetAPI

// [out:json][timeout:25];
// node["leisure"="playground"](59.0,17.5,60.2,19.0);
// out body;
