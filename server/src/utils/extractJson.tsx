import { AppError } from "../middlewares/error.middleware";

// Helper: safely extract and parse JSON from model output
const extractJSON = (text: any) => {
  try {
    // Find the first valid JSON object using regex
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new AppError("No valid JSON found in response");

    // Clean newlines and parse
    const cleanText = match[0].replace(/\n/g, "");
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return null;
  }
};

export default extractJSON;
