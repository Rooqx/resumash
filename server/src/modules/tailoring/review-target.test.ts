import { test, expect } from "bun:test";
import { validReviewTarget, validatedReviewSuggestions } from "./review-target";
import type { z } from "zod";
import type { tailoringResultSchema } from "./tailor.schema";

type Result = z.infer<typeof tailoringResultSchema>;

const fixture: Result = {
 resume: {
  inputValue: { summary: "Helped customers daily" },
  fields: { experience: [{ jobSummary: "Maintained daily inventory records" }] },
  tagFields: {},
 },
 requirements: [{ id: "req1", requirement: "Inventory management", importance: "essential", evidence: "direct", sourceQuote: "Maintained daily inventory records" }],
 suggestions: [{
  section: "experience",
  target: { section: "fields", key: "experience", index: 0, field: "jobSummary" },
  sourceQuote: "Maintained daily inventory records",
  original: "Maintained daily inventory records",
  proposed: "Updated inventory records for daily retail operations",
  reason: "Makes the context clearer",
  priority: "medium",
  changeType: "rewrite",
  requirementId: "req1",
  evidenceLevel: "direct",
  requiresConfirmation: true,
 }],
 missingRequirements: [],
 clarificationQuestions: [],
 writingNotes: [],
};

test("accepts exact source-backed field references", () => {
 expect(validReviewTarget(fixture.resume, fixture.suggestions[0]!)).toBe(true);
 expect(validatedReviewSuggestions(fixture, "Maintained daily inventory records")).toHaveLength(1);
});

test("rejects stale or fabricated field references", () => {
 const item = { ...fixture.suggestions[0]!, original: "Another unrelated sentence" };
 expect(validReviewTarget(fixture.resume, item)).toBe(false);
 expect(validatedReviewSuggestions({ ...fixture, suggestions: [item] }, "Maintained daily inventory records")).toHaveLength(0);
});

test("rejects fake provenance or duplicate target proposals", () => {
 expect(validatedReviewSuggestions(fixture, "No matching citation here")).toHaveLength(0);
 expect(validatedReviewSuggestions({ ...fixture, suggestions: [fixture.suggestions[0]!, fixture.suggestions[0]!] }, "Maintained daily inventory records")).toHaveLength(1);
});


test("permits independently proposed, source-backed experience bullet edits", () => {
  const bullet = "Built APIs with Node.js";
  const result: Result = {
    ...fixture,
    resume: { ...fixture.resume, tagFields: {
      "jobHighlights-0": { tags: [bullet], input: "", suggestions: [] },
    }},
    suggestions: [{ ...fixture.suggestions[0]!, section: "experience",
      target: { section: "tagFields", key: "jobHighlights-0", index: 0, field: "tags" },
      sourceQuote: bullet, original: bullet,
      proposed: "Developed Node.js APIs", requirementId: "req1",
    }],
  };
  expect(validReviewTarget(result.resume, result.suggestions[0]!)).toBe(true);
  expect(validatedReviewSuggestions(result, bullet)).toHaveLength(1);
  expect(validatedReviewSuggestions({ ...result, suggestions: [
    { ...result.suggestions[0]!, target: { section: "tagFields", key: "jobHighlights-9", index: 0, field: "tags" } },
  ]}, bullet)).toHaveLength(0);
});
