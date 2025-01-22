import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as playgroundRouter } from "./routes/playground-routes";
import { router as userRouter } from "./routes/user-routes";

dotenv.config();

// MongoDB connection
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-playground";
mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

// Express app setup
const app = express();
const port = process.env.PORT || 9010;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/playgrounds", playgroundRouter);
app.use("/user", userRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Playground API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// Start the server
app
  .listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${port} is already in use. Please use a different port.`
      );
    } else {
      console.error(err);
    }
  });

// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { router } from "./routes/playground-routes";
// import { router as userRouter } from "./routes/user-routes";

// dotenv.config();

// const mongoUrl =
//   process.env.MONGO_URL || "mongodb://localhost/project-playground";
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("Connected to MongoDB Atlas"))
//   .catch((error) => console.log("Error connecting to MongoDB Atlas:", error));
// if (!mongoUrl) {
//   throw new Error("MONGO_URL is not defined");
// }

// const port = process.env.PORT || 9000;
// const app = express();

// app.use(cors());
// app.use(express.json());

// // This will prefix all the routes in playgroundRoutes with /api/playgrounds
// app.use("/api/playgrounds", router);
// app.use("/user", userRouter);

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
