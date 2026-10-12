import { expect, test } from "bun:test";
import { z } from "zod";
import { normalizeAiResponse, summarizeSchemaIssues } from "./response-validation";

test("normalizes only a single result wrapper", () => {
  expect(normalizeAiResponse({ result: { resume: {} } })).toEqual({ resume: {} });
  expect(normalizeAiResponse({ result: { resume: {} }, metadata: {} })).toEqual({ result: { resume: {} }, metadata: {} });
  expect(normalizeAiResponse({ resume: { sourceQuote: "unchanged" } })).toEqual({ resume: { sourceQuote: "unchanged" } });
});

test("schema diagnostics never reveal unknown property keys or values", () => {
  const parsed = z.object({ resume: z.object({ fields: z.array(z.string()) }) }).safeParse({
    resume: { fields: [123] }
  });
  if (parsed.success) throw new Error("Expected validation failure");
  expect(summarizeSchemaIssues(parsed.error)).toEqual([
    { path: "resume.fields.[index]", code: "invalid_type" }
  ]);
  const unknownKey = z.object({ suggestions: z.object({}).strict() }).safeParse({
    suggestions: { "private-email@example.com": "sensitive" }
  });
  if (unknownKey.success) throw new Error("Expected strict-key failure");
  expect(JSON.stringify(summarizeSchemaIssues(unknownKey.error))).not.toContain("private-email");
});
