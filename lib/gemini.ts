
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("Missing GEMINI_API_KEY environment variable.");
}

// Export the client instance so we can try different models dynamically
export const genAI = new GoogleGenerativeAI(apiKey);
