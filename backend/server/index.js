import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import recipeRoutes from "./api/recipe.js";

dotenv.config(); // Load environment variables

const app = express(); // Create Express app instance

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET"],
    credentials: true,
  })
); // enable cors for all routes
app.use(express.json()); // parse JSON bodies

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("🟢 MongoDB Connected Successfully");
    console.log("Connected to Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.log("🔴 MongoDB Connection Error:");
    console.error(err);
  });

// Routes
app.use("/api", recipeRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`
🚀 Server is running!
📡 PORT: ${port}
🌐 API endpoints:
   POST: http://localhost:${port}/api/recipe

  `);
});
