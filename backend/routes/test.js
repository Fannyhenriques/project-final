import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcrypt-nodejs";

dotenv.config();
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-playground";
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
  source: { type: String, enum: ["Stockholm", "Google"] },
  facilities: [String], // ex. "Swings", "Slides"
  images: [String], // URL
  ratings: { type: Number },
  googlePlaceId: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
//exporting named export for flexibility instead of default
export const Playground = mongoose.model("Playground", playgroundSchema);
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
    default: () => crypto.randomBytes(128).toString("hex"),
  },
});
//middleware for authentication
const authenticateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      accessToken: req.header("Authorization"),
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res
        .status(401)
        .json({ loggedOut: true, message: "Invalid access token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//GET-ROUTES
app.get("/", (req, res) => {
  res.send("This is the playground app!");
});

//[out:json][timeout:25];
// node["leisure"="playground"](59.0,17.5,60.2,19.0);
// out body;
