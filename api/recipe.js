// api/recipe.js
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Schemas
const recipeSchema = new mongoose.Schema({
  ingredients: [String],
  recipe: String,
  createdAt: { type: Date, default: Date.now },
  // Add more fields if needed, like:
  title: String,
  cookingTime: Number,
  servings: Number,
});

const requestCounterSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  count: { type: Number, default: 0 },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
const RequestCounter = mongoose.model("RequestCounter", requestCounterSchema);

// Connect to MongoDB
mongoose
  .connect(import.meta.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// You can also listen for connection events
mongoose.connection.on("error", (err) => {
  console.log("🔴 MongoDB Error:", err);
});
// Date utilities

// Initialize MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(import.meta.env.MONGODB_URI);

  const db = client.db(import.meta.env.MONGODB_DB);
  cachedDb = db;
  console.log("connected to Mongodb");
  return db;
}

// Get JST date utilities
function getJSTDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
}

function setJSTMidnight(date) {
  const jstDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
  jstDate.setHours(0, 1, 0, 0);
  return jstDate;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();
    const requestsCollection = db.collection("requests");

    // Get current JST time and today's start
    const nowJST = getJSTDate();
    const todayStartJST = setJSTMidnight(nowJST);

    // Get today's request count
    const todayRequests = await requestsCollection.findOne({
      date: { $gte: todayStartJST },
    });

    const currentCount = todayRequests?.count || 0;

    // Check daily limit
    if (currentCount >= 100) {
      const tomorrowStartJST = new Date(todayStartJST);
      tomorrowStartJST.setDate(tomorrowStartJST.getDate() + 1);

      return res.status(429).json({
        error: "Daily limit exceeded. Please try again tomorrow.",
        currentCount,
        nextReset: tomorrowStartJST,
        timeZone: "JST",
      });
    }

    // Get ingredients from request
    const { ingredientsArray } = req.body;

    if (!ingredientsArray || !Array.isArray(ingredientsArray)) {
      return res.status(400).json({ error: "Invalid ingredients array" });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: import.meta.env.CLAUDE_API_KEY,
    });

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system:
        "You are an expert assistant that receives a list of ingredients and suggests a recipe they could make with some or all of those ingredients. Format your response in markdown.",
      messages: [
        {
          role: "user",
          content: `I have ${ingredientsArray.join(
            ", "
          )}. Please give me a recipe`,
        },
      ],
    });

    // Update request count in MongoDB
    await requestsCollection.updateOne(
      { date: todayStartJST },
      {
        $inc: { count: 1 },
        $setOnInsert: { date: todayStartJST },
      },
      { upsert: true }
    );

    // Send successful response
    res.status(200).json({
      recipe: response.content[0].text,
      remainingRequests: 100 - (currentCount + 1),
      nextReset: new Date(todayStartJST.getTime() + 24 * 60 * 60 * 1000),
      timeZone: "JST",
    });
  } catch (error) {
    console.error("API Error:", error);
    if (error.status === 401) {
      res.status(401).json({ error: "Invalid API Key" });
    } else {
      res.status(500).json({
        error: "Failed to generate recipe",
        details: error.message,
      });
    }
  }
}
