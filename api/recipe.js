import Anthropic from "@anthropic-ai/sdk";

// Daily request limit
const DAILY_LIMIT = 100;

// This ensures we're working in JST timezone
function getJSTDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
}

// Function to set time to 12:01 AM JST for a given date
function setJSTMidnight(date) {
  const jstDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
  jstDate.setHours(0, 1, 0, 0);
  return jstDate;
}

// Tracks both count and the exact start time in JST
let requestTracker = {
  count: 0,
  startTime: setJSTMidnight(new Date()), // 12:01 AM JST today
};

const SYSTEM_PROMPT = `You are an expert assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page`;

// Check if we're in development
const isDevEnvironment = process.env.MODE_ENV === "development";

// Use the appropriate env variable access method
const apiKey = isDevEnvironment
  ? import.meta.env.ANTHROPIC_API_KEY
  : process.env.ANTHROPIC_API_KEY;

// Serverless Function.
// Front end makes a request to /api/recipe
// Serverless Function wakes up and calls Anthropic
// Anthropic returns recipe
// Serverless Function sends recipe back to frontend
// Serverless Function goes back to sleep

export default async function handler(req, res) {
  // Check if request is a POST request
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  //
  const nowJST = getJSTDate(); // get current time in Japan
  const todayStartJST = setJSTMidnight(nowJST); // get today at 12:01 AM in Japan

  // Check if we need to reset the counter (it's past midnight JST)
  if (nowJST >= todayStartJST && requestTracker.startTime < todayStartJST) {
    requestTracker = {
      count: 0,
      startTime: todayStartJST,
    };
  }

  // Check if we've hit the daily limit
  if (requestTracker.count >= DAILY_LIMIT) {
    // Calculate time until next reset (12:01 AM JST tomorrow)
    const tomorrowJST = new Date(nowJST);
    tomorrowJST.setDate(tomorrowJST.getDate() + 1);
    tomorrowJST.setHours(0, 1, 0, 0);

    return res.status(429).json({
      error: "Daily limit exceeded. Please try again tomorrow.",
      currentCount: requestTracker.count,
      limitResetTime: tomorrowJST,
      timeZone: "JST",
    });
  }

  try {
    // Initialize Anthropic with your API Key
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Get ingredients Array from request body
    const { ingredientsArray } = req.body;

    // Make API Call to Anthropic
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `I have ${ingredientsArray.join(
            ", "
          )}. Please give me a recipe`,
        },
      ],
    });

    // Increment the counter
    requestTracker.count++;

    // Calculate time until next reset in JST
    const nextResetJST = new Date(nowJST);
    nextResetJST.setDate(nextResetJST.getDate() + 1);
    nextResetJST.setHours(0, 1, 0, 0);

    // send successful response back to frontend
    res.status(200).json({
      recipe: msg.content[0].text,
      remainingRequests: DAILY_LIMIT - requestTracker.count,
      nextReset: nextResetJST,
      timeZone: "JST",
      currentTimeJST: nowJST,
    });
  } catch (error) {
    console.error("API Error", error);
    res.status(500).json({ error: "Failed to get recipe" });
  }
}
