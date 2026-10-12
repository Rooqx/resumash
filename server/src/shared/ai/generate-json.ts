import OpenAI from "openai";
import { z } from "zod";
import { AppError } from "../../middlewares/error.middleware";
import { logger } from "../../utils/logger";
import { estimateAiCost, getRequestContext, safeProviderError } from "../../utils/observability";
import { normalizeAiResponse, summarizeSchemaIssues } from "./response-validation";

/** Maximum number of simultaneous model requests on each API instance. */
const MAX_CONCURRENT_GENERATIONS = 6;
let activeGenerations = 0;

/**
 * OpenAI-compatible generation gateway.
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
  schema: T,
  options: { timeoutMs?: number; maxRetries?: number } = {},
): Promise<z.infer<T>> {
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.MODEL;
  const endpoint = process.env.LLM_URL;
  const provider = /^[a-z0-9_-]{1,48}$/i.test(process.env.LLM_PROVIDER ?? "") ? process.env.LLM_PROVIDER! : "openai-compatible";
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

  // Tailoring can temporarily use a longer single attempt for latency diagnosis.
  const timeoutMs = options.timeoutMs ?? 60_000;
  const maxRetries = options.maxRetries ?? 1;
  const client = new OpenAI({ apiKey, baseURL, timeout: timeoutMs, maxRetries });
  // Cap in-flight paid calls per Express instance. This is independent
  // of per-IP Redis quotas and protects against traffic from many IPs.
  if (activeGenerations >= MAX_CONCURRENT_GENERATIONS) {
    throw new AppError("AI service is busy. Please retry shortly.", 503);
  }
  activeGenerations++;
  const started = performance.now();
  const trace = getRequestContext();
  logger.info("ai.request.started", { event:"ai.request.started", requestId:trace?.requestId, provider, model, activeGenerations });
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
    const usage = completion.usage;
    logger.info("ai.request.completed", {
      event:"ai.request.completed", requestId:trace?.requestId,
      provider, model, durationMs:Math.round(performance.now()-started),
      promptTokens:usage?.prompt_tokens ?? null,
      completionTokens:usage?.completion_tokens ?? null,
      totalTokens:usage?.total_tokens ?? null,
      estimatedCostUsd:estimateAiCost(usage?.prompt_tokens, usage?.completion_tokens),
      finishReason:completion.choices[0]?.finish_reason ?? null,
      maxSdkRetries:maxRetries,
      configuredTimeoutMs:timeoutMs,
      costBasis:"reported_usage_only",
    });
  } catch (error) {
    logger.error("ai.request.failed", {
      event:"ai.request.failed", requestId:trace?.requestId, provider,
      model, durationMs:Math.round(performance.now()-started),
      maxSdkRetries:maxRetries,
      configuredTimeoutMs:timeoutMs,
      ...safeProviderError(error),
    });
    throw new AppError("AI service is temporarily unavailable", 502);
  } finally {
    activeGenerations--;
  }
  if (!response || response.length > 100_000) {
    logger.warn("ai.response.invalid", { event:"ai.response.invalid", requestId:trace?.requestId, reason:"empty_or_oversized" });
    throw new AppError("AI generated an empty or oversized response", 502);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(response);
  } catch {
    logger.warn("ai.response.invalid", { event:"ai.response.invalid", requestId:trace?.requestId, reason:"json_parse" });
    throw new AppError("AI response was not valid JSON", 502);
  }
  const validated = schema.safeParse(normalizeAiResponse(parsed));
  if (!validated.success) {
    logger.warn("ai.response.invalid", { event:"ai.response.invalid", requestId:trace?.requestId, reason:"schema_validation", issueCount:validated.error.issues.length, issues:summarizeSchemaIssues(validated.error) });
    throw new AppError("AI response did not match its expected structure", 502);
  }
  logger.info("ai.response.validated", { event:"ai.response.validated", requestId:trace?.requestId, provider, model, totalDurationMs:Math.round(performance.now()-started) });
  return validated.data;
}
