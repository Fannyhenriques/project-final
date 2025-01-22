import mongoose from "mongoose";

const googlePlaygroundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    source: { type: String, enum: ["Stockholm", "Google"], default: "Google" },
    facilities: [String], // e.g., "Swings", "Slides"
    images: [
      {
        height: { type: Number },
        html_attributions: { type: [String] },
        photo_reference: { type: String },
        width: { type: Number },
      },
    ],
    ratings: { type: [Number], min: 1, max: 5, default: [] },
    googlePlaceId: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

googlePlaygroundSchema.index({ location: "2dsphere" });

export const GooglePlayground = mongoose.model(
  "GooglePlayground",
  googlePlaygroundSchema
);
