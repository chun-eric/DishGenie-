import { HfInference } from "@huggingface/inference";

export const SYSTEM_PROMPT = `
You are an expert assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

// 🚨👉 ALERT:  don't commit your API keys
// to any repositories and don't deploy your project anywhere
// live online. Otherwise, anyone could inspect your source
// and find your API keys/tokens. If you want to deploy
// this project, you'll need to create a backend of some kind,
// either your own or using some serverless architecture where
// your API calls can be made. Doing so will keep your
// API keys private.

// Add the validation here, before creating any API instances

if (import.meta.env.HUGGINGFACE_API_KEY) {
  throw new Error("Missing Hugging Face API key");
}

// API Call
export async function getRecipeFromDishGenie(ingredientsArray) {
  try {
    const response = await fetch("/api/recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredientsArray }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe");
    }

    const data = await response.json();
    return data.recipe;
  } catch (error) {
    console.error("Error calling Anthropic API:", error.message);
    throw error;
  }
}

// Hugging Face Instace
const hf = new HfInference(import.meta.env.HUGGINGFACE_API_KEY);

// API Call
export async function getRecipeFromMistral(ingredientsArray) {
  const ingredientsString = ingredientsArray.join(", ");

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error.message);
  }
}
