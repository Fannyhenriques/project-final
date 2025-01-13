import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcrypt-nodejs";
import playgroundRoutes from "./routes/playground-routes.js";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-playground";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse incoming JSON requests

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Routes
app.use(playgroundRoutes); // Use the playground routes directly

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Playground API");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
