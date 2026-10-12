import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import { logger } from "./logger";

interface RequestContext {
  requestId: string;
  method: string;
  route: string;
}
const context = new AsyncLocalStorage<RequestContext>();

export const getRequestContext = () => context.getStore();

/** Avoid query strings because they may contain private information. */
export function safePath(path: string): string {
  // Only emit known route families. Never log arbitrary client URL segments.
  if (path === "/") return "/";
  if (path.startsWith("/api/v1/resumes/")) return "/api/v1/resumes/*";
  if (path.startsWith("/api/v1/cover-letters/")) return "/api/v1/cover-letters/*";
  return "/other";
}

export function routeOperation(path: string): string {
  const operations: Record<string,string> = {
    "/api/v1/resumes/ai-build": "resume.ai_build",
    "/api/v1/resumes/upload": "resume.tailor",
    "/api/v1/resumes/download-resume": "resume.legacy_pdf",
    "/api/v1/cover-letters/generate": "cover_letter.generate",
  };
  return operations[path] ?? "other";
}

/**
 * Trace each request without recording IPs, headers or submitted resume data.
 * requestId is server-generated, so clients cannot forge correlation IDs.
 */
export const requestTelemetry: RequestHandler = (req, res, next) => {
  const requestId = randomUUID();
  const started = performance.now();
  const route = safePath(req.path);
  const operation = routeOperation(req.path);
  res.setHeader("X-Request-ID", requestId);

  context.run({ requestId, method: req.method, route }, () => {
    logger.debug("http.request.started", { event: "http.request.started", requestId, method: req.method, route, operation });
    let finished = false;
    res.once("finish", () => {
      finished = true;
      logger.log(res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
        "http.request.completed", {
          event: "http.request.completed", requestId, method: req.method,
          route, operation, status: res.statusCode,
          durationMs: Math.round(performance.now() - started),
        });
    });
    res.once("close", () => {
      if (!finished) logger.warn("http.request.aborted", { event:"http.request.aborted", requestId, method:req.method, route, operation, durationMs: Math.round(performance.now()-started) });
    });
    next();
  });
};

/** Metadata-only provider failures: do not log raw SDK errors or bodies. */
export function safeProviderError(error: unknown): {
  status?: number; code?: string; type?: string; requestId?: string; category: string;
} {
  if (!error || typeof error !== "object") return { category: "unknown" };
  const record = error as Record<string, unknown>;
  const status = typeof record.status === "number" ? record.status : undefined;
  const allowed = (v: unknown) => typeof v === "string" && /^[a-zA-Z0-9_.-]{1,72}$/.test(v) ? v : undefined;
  const code = allowed(record.code);
  const type = allowed(record.type);
  const requestId = allowed(record.request_id);
  const name = allowed(record.name);
  const category = status === 401 || status === 403 ? "authentication" :
    status === 402 ? "billing" : status === 429 ? "rate_limit" :
    status !== undefined && status >= 500 ? "provider_failure" :
    name === "APIConnectionTimeoutError" ? "timeout" :
    name === "APIConnectionError" ? "connection" :
    status !== undefined ? "provider_rejection" : "unknown";
  return { status, code, type, requestId, category };
}

/**
 * Prices are optional USD per million tokens. Without verified prices, report
 * null rather than inventing costs. Configure from your provider's dashboard.
 */
export function estimateAiCost(promptTokens?: number, completionTokens?: number): number | null {
  const inputRate = process.env.LLM_INPUT_USD_PER_MILLION;
  const outputRate = process.env.LLM_OUTPUT_USD_PER_MILLION;
  if (!inputRate || !outputRate || promptTokens === undefined || completionTokens === undefined) return null;
  const input = Number(inputRate), output = Number(outputRate);
  if (!Number.isFinite(input) || !Number.isFinite(output) || input < 0 || output < 0) return null;
  return Number(((promptTokens * input + completionTokens * output) / 1_000_000).toFixed(8));
}
