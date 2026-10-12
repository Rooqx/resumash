import { describe, expect, test } from "bun:test";
import { estimateAiCost, safeProviderError, safePath, routeOperation } from "./observability";

describe("privacy-safe provider diagnostics", () => {
  test("keeps status and harmless error codes but drops raw provider content", () => {
    const result = safeProviderError({
      status: 401, code: "invalid_api_key", request_id: "req-abc123",
      message: "secret private resume body", response: { authorization: "secret" }
    });
    expect(result).toEqual({
      status: 401, code: "invalid_api_key", requestId: "req-abc123",
      type: undefined, category: "authentication"
    });
    expect(JSON.stringify(result)).not.toContain("secret");
  });

  test("rejects suspicious provider-supplied metadata", () => {
    const result = safeProviderError({
      status: 429, code: "leak: Authorization Bearer abc\n", request_id: "private user info"
    });
    expect(result.category).toBe("rate_limit");
    expect(result.code).toBeUndefined();
    expect(result.requestId).toBeUndefined();
  });
});

describe("AI cost estimation", () => {
  test("uses USD per million tokens when verified rates are configured", () => {
    const oldIn = process.env.LLM_INPUT_USD_PER_MILLION;
    const oldOut = process.env.LLM_OUTPUT_USD_PER_MILLION;
    try {
      process.env.LLM_INPUT_USD_PER_MILLION = "1.5";
      process.env.LLM_OUTPUT_USD_PER_MILLION = "4";
      expect(estimateAiCost(1000,500)).toBe(0.0035);
      expect(estimateAiCost(undefined,500)).toBeNull();
      process.env.LLM_INPUT_USD_PER_MILLION = "-1";
      expect(estimateAiCost(1000,500)).toBeNull();
    } finally {
      if (oldIn === undefined) delete process.env.LLM_INPUT_USD_PER_MILLION;
      else process.env.LLM_INPUT_USD_PER_MILLION = oldIn;
      if (oldOut === undefined) delete process.env.LLM_OUTPUT_USD_PER_MILLION;
      else process.env.LLM_OUTPUT_USD_PER_MILLION = oldOut;
    }
  });
});

describe("bounded HTTP request telemetry", () => {
  test("never logs unknown URL segments or query strings", () => {
    expect(safePath("/api/v1/resumes/ai-build?token=secret")).toBe("/api/v1/resumes/*");
    expect(safePath("/private/alex@example.com/secret")).toBe("/other");
    expect(safePath("/")).toBe("/");
  });
  test("classifies only known feature operations", () => {
    expect(routeOperation("/api/v1/resumes/ai-build")).toBe("resume.ai_build");
    expect(routeOperation("/api/v1/resumes/upload")).toBe("resume.tailor");
    expect(routeOperation("/api/v1/cover-letters/generate")).toBe("cover_letter.generate");
    expect(routeOperation("/private/secret")).toBe("other");
  });
});
