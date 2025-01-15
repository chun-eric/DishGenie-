// api/recipe.js
import express from "express";
import mongoose from "mongoose";
import { generateRecipe, checkDailyLimit } from "../services/recipeService.js";

const router = express.Router();

// Generate recipe endpoint
router.post("/recipe", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    // Log the incoming request body
    console.log("Received request body:", req.body);

    const { ingredients } = req.body;

    // Validate request for at least 3 ingredients
    if (!req.body?.ingredients?.length >= 3) {
      return res.status(400).json({
        error: "Please provide at least 3 ingredients",
      });
    }

    // validate daily counter
    await session.withTransaction(async () => {
      // Check rate limit
      const { counter, isLimitExceeded, resetTime } = await checkDailyLimit(
        session
      );

      if (isLimitExceeded) {
        return res.status(429).json({
          error: "Daily limit exceeded. Please try again tomorrow.",
          nextReset: resetTime,
          timeZone: "JST",
        });
      }

      // Generate recipe
      const recipe = await generateRecipe(ingredients, session);

      // Update counter
      counter.count += 1;
      await counter.save({ session });

      // Send response
      res.json({
        recipe,
        remainingRequests: 100 - counter.count,
        nextReset: resetTime,
        timeZone: "JST",
      });
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(error.status || 500).json({
      error:
        error.status === 401 ? "Invalid API Key" : "Failed to generate recipe",
      details: error.message,
    });
  } finally {
    session.endSession();
  }
});

export default router;
