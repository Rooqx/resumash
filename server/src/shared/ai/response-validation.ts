import type { z } from "zod";

/**
 * Only normalize an unequivocal output-wrapper artifact. Never change resume
 * facts, evidence labels, quotation text or unsupported field types.
 */
export function normalizeAiResponse(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const object = value as Record<string, unknown>;
  // Some OpenAI-compatible models wrap a JSON object in a single "result" key.
  // Keep the existing strict schema responsible for accepting or rejecting it.
  if (Object.keys(object).length === 1 && object.result &&
      typeof object.result === "object" && !Array.isArray(object.result)) {
    return object.result;
  }
  return value;
}

/** Paths are drawn from an allowlist to prevent revealing user-supplied keys. */
const safeNames = new Set([
  "resume","inputValue","fields","tagFields","tags","input","suggestions",
  "experience","education","skills","projects","certificates","awards",
  "section","target","sourceQuote","original","proposed","reason","priority",
  "changeType","requirementId","evidenceLevel","requiresConfirmation",
  "requirements","id","requirement","importance","evidence",
  "missingRequirements","clarificationQuestions","question","writingNotes",
]);
export function summarizeSchemaIssues(error: z.ZodError) {
  return error.issues.slice(0, 12).map(issue => {
    const path = issue.path.map(segment =>
      typeof segment === "number" ? "[index]" :
      safeNames.has(String(segment)) ? String(segment) : "[field]"
    ).join(".");
    return { path: path.slice(0, 120), code: issue.code };
  });
}
