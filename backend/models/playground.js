const mongoose = require("mongoose");

const playgroundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    source: {
      type: String,
      enum: ["Stockholm", "Google"],
    },
    facilities: [
      {
        type: String,
        enum: [
          "Swings",
          "Slides",
          "Climbing Frames",
          "Sandpit",
          "Benches",
          "Toilets",
        ], // Add your facilities here
      },
    ],
    images: [String], // Array of image URLs
    ratings: { type: Number, min: 1, max: 5 }, // Rating between 1 and 5
    googlePlaceId: { type: String },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  {
    // This option creates a 2dsphere index for geospatial queries
    timestamps: true,
  }
);

// Create a 2dsphere index to enable geospatial queries  (to be able to find places nearby)
playgroundSchema.index({ location: "2dsphere" });

const Playground = mongoose.model("Playground", playgroundSchema);

module.exports = Playground;
