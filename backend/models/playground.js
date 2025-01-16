import mongoose from "mongoose";

const playgroundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    source: { type: String, enum: ["Stockholm", "Google"] },
    facilities: [String], // ex. "Swings", "Slides"
    images: [
      {
        height: { type: Number },
        html_attributions: { type: [String] },
        photo_reference: { type: String },
        width: { type: Number },
      },
    ],
    ratings: { type: Number, min: 1, max: 5, default: 1 },
    googlePlaceId: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], //[longitude, latitude]
      },
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// enable geospatial queries (to be able to find places nearby)
playgroundSchema.index({ location: "2dsphere" });

export const Playground = mongoose.model("Playground", playgroundSchema);
