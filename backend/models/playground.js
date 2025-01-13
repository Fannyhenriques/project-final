const mongoose = require("mongoose");

const playgroundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

playgroundSchema.index({ location: "2dsphere" }); // Geospatialt index

module.exports = mongoose.model("Playground", playgroundSchema);
