import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/playground-routes";
import { router as userRouter } from "./routes/user-routes";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-playground";
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log("Error connecting to MongoDB Atlas:", error));
if (!mongoUrl) {
  throw new Error("MONGO_URL is not defined");
}

const port = process.env.PORT || 9000;
const app = express();

app.use(cors({
  origin: "https://playgroundfinder.netlify.app/",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));
// app.use(cors());
app.use(express.json());

// This will prefix all the routes in playgroundRoutes with /api/playgrounds
app.use("/api/playgrounds", router);
app.use("/user", userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});