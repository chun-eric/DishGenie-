// contains Mongoose schemas for recipe data structure
// request counter for rate limiting

// MongoDB Schemas
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  ingredients: [String],
  recipe: String,
  createdAt: { type: Date, default: Date.now },
  title: String,
  cookingTime: Number,
  servings: Number,
});

const requestCounterSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true, // Add index for faster queries
  },
  count: {
    type: Number,
    default: 0,
    min: 0,
    max: 100, // Max daily limit
  },
  resetTime: {
    type: Date,
    required: true,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
const RequestCounter = mongoose.model("RequestCounter", requestCounterSchema);

export { Recipe, RequestCounter };
