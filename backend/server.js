import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import playgroundRoutes from "./routes/playground-routes";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-playground";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

// This will prefix all the routes in playgroundRoutes with /api/playgrounds
app.use("/api/playgrounds", playgroundRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//Query openstreetAPI

// [out:json][timeout:25];
// node["leisure"="playground"](59.0,17.5,60.2,19.0);
// out body;
