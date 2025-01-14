import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Mongo Schema

const requestCounterSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  count: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", requestCounterSchema);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("🟢 MongoDB Connected Successfully");
    console.log("Database URL:", process.env.MONGODB_URI);

    // Get connection details
    const connection = mongoose.connection;
    console.log("Connection State:", connection.readyState);
    console.log("Connected to Database:", connection.name);
  })
  .catch((err) => {
    console.log("🔴 MongoDB Connection Error:");
    console.error(err);
  });

// MongoDB Schema
const recipeSchema = new mongoose.Schema({
  ingredients: [String],
  recipe: String,
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// MongoDB Connection with better logging
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("🟢 MongoDB Connected Successfully");
    console.log("Database URL:", process.env.MONGODB_URI);

    // Get connection details
    const connection = mongoose.connection;
    console.log("Connection State:", connection.readyState);
    console.log("Connected to Database:", connection.name);
  })
  .catch((err) => {
    console.log("🔴 MongoDB Connection Error:");
    console.error(err);
  });

// Recipe Generation Endpoint
app.post("/api/recipe", async (req, res) => {
  try {
    const { ingredientsArray } = req.body;

    if (!ingredientsArray || !Array.isArray(ingredientsArray)) {
      return res.status(400).json({ error: "Invalid ingredients array" });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system:
        "You are an expert assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page",
      messages: [
        {
          role: "user",
          content: `I have ${ingredientsArray.join(
            ", "
          )}. Please give me a recipe`,
        },
      ],
    });

    // Save recipe to MongoDB
    const newRecipe = new Recipe({
      ingredients: ingredientsArray,
      recipe: response.content[0].text,
    });
    await newRecipe.save();
    console.log("💾 Recipe saved to database");

    // Send response
    res.status(200).json({
      recipe: response.content[0].text,
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({
      error: "Failed to generate recipe",
      details: error.message,
    });
  }
});

// Get all recipes endpoint
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    console.log(`📋 Retrieved ${recipes.length} recipes`);
    res.json(recipes);
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server is running!
  📡 PORT: ${PORT}
  🌐 API endpoints:
     POST: http://localhost:${PORT}/api/recipe
     GET:  http://localhost:${PORT}/api/recipes
    `);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
