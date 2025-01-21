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
    ratings: { type: [Number], min: 1, max: 5, default: [] },
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


// Method to add a rating and update the average (called by the controller)
playgroundSchema.methods.addRating = function (newRating) {
  if (newRating >= 1 && newRating <= 5) {
    this.ratings.push(newRating);
    return this.save();
  } else {
    throw new Error('Rating must be between 1 and 5');
  }
};

// Helper method to calculate average rating
playgroundSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    return null; // No ratings yet
  }
  const total = this.ratings.reduce((sum, rating) => sum + rating, 0);
  return total / this.ratings.length;
};

// enable geospatial queries (to be able to find places nearby)
playgroundSchema.index({ location: "2dsphere" });

export const Playground = mongoose.model("Playground", playgroundSchema);
