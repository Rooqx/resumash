import OpenAI from "openai";
import { z } from "zod";
import { AppError } from "../../middlewares/error.middleware";

/** Maximum number of simultaneous model requests on each API instance. */
const MAX_CONCURRENT_GENERATIONS = 6;
let activeGenerations = 0;

/**
 * OpenAI-compatible Atria generation gateway.
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
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.MODEL;
  const endpoint = process.env.LLM_URL;
  if (!apiKey || !model || !endpoint) {
    throw new AppError("AI generation is not configured", 503);
  }
  // The SDK automatically appends /chat/completions. Accept either a base URL
  // or a full endpoint value from a deployment dashboard.
  let baseURL: string;
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
      throw new Error("Unsupported API URL protocol");
    }
    const pathname = url.pathname.replace(/\/+$/, "");
    const basePath = pathname.endsWith("/chat/completions")
      ? pathname.slice(0, -"/chat/completions".length)
      : pathname;
    if (!basePath.endsWith("/v1") || url.search || url.hash) {
      throw new Error("Expected /v1 or /v1/chat/completions URL");
    }
    url.pathname = basePath;
    baseURL = url.toString().replace(/\/$/, "");
  } catch {
    throw new AppError("LLM_URL must be a valid /v1 Chat Completions API URL", 503);
  }

  const client = new OpenAI({
    apiKey,
    baseURL,
    timeout: 60_000,
    maxRetries: 1,
  });
  // Cap in-flight paid calls per Express instance. This is independent
  // of per-IP Redis quotas and protects against traffic from many IPs.
  if (activeGenerations >= MAX_CONCURRENT_GENERATIONS) {
    throw new AppError("AI service is busy. Please retry shortly.", 503);
  }
  activeGenerations++;
  let response: string | undefined | null;
  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: instructions + "\nReturn one valid JSON object only." },
        { role: "user", content: JSON.stringify({ untrustedUserData: input }) },
      ],
    });
    response = completion.choices[0]?.message?.content;
  } catch {
    throw new AppError("AI service is temporarily unavailable", 502);
  } finally {
    activeGenerations--;
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
