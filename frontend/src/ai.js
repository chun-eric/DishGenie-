// import { HfInference } from "@huggingface/inference";

// 🚨👉 ALERT:  don't commit API keys to any repositories and don't deploy your project anywhere
// live online. Otherwise, anyone could inspect your source
// and find your API keys/tokens. If you want to deploy
// this project, you'll need to create a backend of some kind,
// either your own or using some serverless architecture where
// your API calls can be made. Doing so will keep your
// API keys private.

// Add the validation here, before creating any API instances

// API Call

const API_URL = import.meta.env.VITE_API_URL;

// || "http://localhost:3000";

export async function getRecipeFromDishGenie(ingredients) {
  try {
    // Debug log to see exact format of ingredients
    console.log("Type of ingredients:", typeof ingredients);
    console.log("Ingredients value:", ingredients);

    const response = await fetch(`${API_URL}/api/recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      }),
    });
    console.log("Response status:", response.status); // Debug log

    // Check if the response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText); // Debug log
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // return recipe data to frontend
    const data = await response.json();
    console.log("Parsed response data:", data); // Log parsed data
    console.log(data.recipe);

    return data.recipe;
  } catch (error) {
    console.error("Failed to get recipe:", error);
    throw new Error("Failed to get recipe. Please try again later.");
  }
}

// if (import.meta.env.HUGGINGFACE_API_KEY) {
//   throw new Error("Missing Hugging Face API key");
// }

// Hugging Face Instace
// const hf = new HfInference(import.meta.env.HUGGINGFACE_API_KEY);

// API Call
// export async function getRecipeFromMistral(ingredientsArray) {
//   const ingredientsString = ingredientsArray.join(", ");

//   try {
//     const response = await hf.chatCompletion({
//       model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//       messages: [
//         { role: "system", content: SYSTEM_PROMPT },
//         {
//           role: "user",
//           content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
//         },
//       ],
//     });

//     return response.choices[0].message.content;
//   } catch (error) {
//     console.error(error.message);
//   }
// }
