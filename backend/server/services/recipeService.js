// returns the recipe function

import Anthropic from "@anthropic-ai/sdk";
import { Recipe, RequestCounter } from "../models/schema.js";
import { getJSTDate, setJSTMidnight } from "../utils/dateUtils.js";

// Add a cache map to store recent recipe requests
const recipeCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function generateRecipe(ingredients, session) {
  // Validate ingredients
  if (!Array.isArray(ingredients) || ingredients.length < 3) {
    throw new Error("Please provide at least 3 ingredients in an array");
  }
  // Sort ingredients to ensure consistent cache keys
  const cacheKey = ingredients.sort().join(",");

  // Check cache first
  const cachedRecipe = recipeCache.get(cacheKey);
  if (cachedRecipe) {
    return cachedRecipe;
  }

  const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  try {
    // Format ingredients into a comma-separated string
    const ingredientsList = ingredients.join(", ");

    // response object from Anthropic
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system:
        "You are an expert assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page",

      messages: [
        {
          role: "user",
          content: `I have these ingredients: ${ingredientsList}. Please give me a recipe I can make.`,
        },
      ],
    });

    // Make sure we have a valid response
    if (
      !response.content ||
      !response.content[0] ||
      !response.content[0].text
    ) {
      throw new Error("Invalid response from recipe generation");
    }

    // save recipe
    const recipeText = response.content[0].text; // Store recipe text

    // save recipe to database
    const newRecipe = new Recipe({
      ingredients,
      recipe: recipeText,
    });

    await newRecipe.save({ session });

    // Add to cache
    recipeCache.set(cacheKey, recipeText);

    // Set cache expiration
    setTimeout(() => {
      recipeCache.delete(cacheKey);
    }, CACHE_DURATION);

    return recipeText;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe: " + error.message);
  }
}

export async function checkDailyLimit(session) {
  const nowJST = getJSTDate();
  const todayStartJST = setJSTMidnight(nowJST);
  const tomorrowJST = new Date(todayStartJST.getTime() + 24 * 60 * 60 * 1000);

  let counter = await RequestCounter.findOne({
    date: { $gte: todayStartJST, $lt: tomorrowJST },
  }).session(session);

  if (!counter) {
    counter = new RequestCounter({
      date: todayStartJST,
      count: 0,
      resetTime: tomorrowJST,
    });
  }

  return {
    counter,
    isLimitExceeded: counter.count >= 100,
    resetTime: tomorrowJST,
  };
}
