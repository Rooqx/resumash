import OpenAI from "openai";
import { z } from "zod";
import { AppError } from "../../middlewares/error.middleware";

/**
 * Lightweight Fireworks-compatible generation gateway.
 * Keeping this single function avoids a provider class hierarchy until a
 * second provider is actually needed.
 *
 * @param instructions - Trusted system-level task rules, including JSON shape.
 * @param input - Validated user content; always treated as data, not instructions.
 * @param schema - Zod contract governing the final model response.
 */
export async function generateJson<T extends z.ZodTypeAny>(
  instructions: string,
  input: unknown,
  schema: T
): Promise<z.infer<T>> {
  const apiKey = process.env.HF_TOKEN;
  const model = process.env.MODEL;
  if (!apiKey || !model) throw new AppError("AI generation is not configured", 503);

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.fireworks.ai/inference/v1",
    timeout: 60_000,
    maxRetries: 1,
  });
  let response: string | undefined | null;
  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: instructions + "\nReturn one valid JSON object only." },
        { role: "user", content: JSON.stringify({ untrustedUserData: input }) },
      ],
    });
    response = completion.choices[0]?.message?.content;
  } catch {
    throw new AppError("AI service is temporarily unavailable", 502);
  }
  if (!response || response.length > 100_000) {
    throw new AppError("AI generated an empty or oversized response", 502);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(response);
  } catch {
    throw new AppError("AI response was not valid JSON", 502);
  }
  const validated = schema.safeParse(parsed);
  if (!validated.success) {
    throw new AppError("AI response did not match its expected structure", 502);
  }
  return validated.data;
}
