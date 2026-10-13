import type { z } from "zod";
import type { tailoringResultSchema } from "./tailor.schema";

type ReviewResult = z.infer<typeof tailoringResultSchema>;
type Suggestion = ReviewResult["suggestions"][number];

/** Only editable prose fields may be changed by AI review suggestions. */
export function validReviewTarget(resume: ReviewResult["resume"], item: Suggestion): boolean {
  const { section, key, index, field } = item.target;
  let current: unknown;
  if (section === "inputValue") {
    if (key !== "summary" || index !== undefined || field !== undefined) return false;
    current = resume.inputValue[key];
  } else if (section === "tagFields") {
    if (!/^jobHighlights-\\d+$/.test(key) || field !== "tags" || !Number.isInteger(index) || index === undefined || index < 0) return false;
    current = resume.tagFields?.[key]?.tags[index];
  } else {
    if (!Number.isInteger(index) || index === undefined) return false;
    if (!((key === "experience" && field === "jobSummary") ||
          (key === "projects" && field === "description"))) return false;
    current = resume.fields[key]?.[index]?.[field!];
  }
  return typeof current === "string" && current === item.original &&
    item.original !== item.proposed && item.proposed.trim().length > 0;
}

/**
 * Exact source quotes prove only textual provenance, not semantic entailment.
 * Invalid field references are excluded rather than being handed to the UI.
 */
export function validatedReviewSuggestions(
  result: ReviewResult,
  source: string,
): ReviewResult["suggestions"] {
  const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();
  const searchable = normalize(source);
  const seen = new Set<string>();
  return result.suggestions.filter(item => {
    if (!validReviewTarget(result.resume, item)) return false;
    if (!searchable.includes(normalize(item.sourceQuote))) return false;
    const id = JSON.stringify(item.target);
    if (seen.has(id)) return false; // one proposed revision per field per request
    seen.add(id);
    return true;
  }).map(item => ({ ...item, requiresConfirmation: true }));
}
