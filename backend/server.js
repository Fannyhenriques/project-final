const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const playgroundRoutes = require("./routes/playgrounds");

dotenv.config();

const app = express();

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
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
