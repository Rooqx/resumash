import { AppError } from "../../middlewares/error.middleware";
import { generateJson } from "../../shared/ai/generate-json";
import { parseResumePdf } from "../resume/parse-pdf";
import { TAILOR_INSTRUCTIONS } from "./tailor.prompt";
import { tailoringResultSchema } from "./tailor.schema";
import { auditResumeWriting, resumeProse } from "../../shared/ai/writing-quality";

/**
 * Verify a cited quote exists in the original candidate document.
 * A model's citation is untrusted until checked against the source.
 */
function quoteExists(source: string, quote: string): boolean {
  const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();
  return normalize(source).includes(normalize(quote));
}

/** Collect distinct numbers from structured resume content for hallucination checks. */
function numericClaims(value: unknown): Set<string> {
  const claims = new Set<string>();
  const walk = (node: unknown) => {
    if (typeof node === "string") {
      for (const match of node.matchAll(/\b\d+(?:[.,]\d+)*(?:%|x)?\b/g)) {
        if (match[0]) claims.add(match[0]);
      }
    } else if (Array.isArray(node)) {
      for (const child of node) walk(child);
    } else if (node && typeof node === "object") {
      for (const child of Object.values(node)) walk(child);
    }
  };
  walk(value);
  return claims;
}

/**
 * Returns a legacy-compatible resume and review metadata.
 * All claims still require candidate review; structural validation and
 * numeric checks reduce mistakes but cannot prove semantic truth.
 */
export async function tailorResume(file: Buffer, jobDescription: string) {
  const sourceText = await parseResumePdf(file);
  const generated = await generateJson(
    TAILOR_INSTRUCTIONS,
    { candidateResume: sourceText, jobDescription },
    tailoringResultSchema,
  );

  const originalNumbers = numericClaims(sourceText);
  // Inspect new AI prose, not dates, phone numbers, titles or immutable IDs.
  const generatedNumbers = numericClaims(resumeProse(generated.resume));
  const unsupportedNumbers = [...generatedNumbers].filter(n => !originalNumbers.has(n));

  if (unsupportedNumbers.length > 0) {
    throw new AppError("AI suggested unsupported numerical claims; please try again", 502);
  }
  // Each review suggestion must refer to a distinct, real job requirement.
  const requirementIds = new Set(generated.requirements.map(item => item.id));
  if (requirementIds.size !== generated.requirements.length) {
    throw new AppError("AI returned duplicate requirement references", 502);
  }
  // Never show a fabricated evidence quote as though it came from the PDF.
  // A related or ambiguous claim stays review-required rather than verified.
  const verifiedSuggestions = generated.suggestions
    .filter(item => quoteExists(sourceText, item.sourceQuote))
    .filter(item => !item.requirementId || requirementIds.has(item.requirementId))
    .map(item => ({
      ...item,
      // Indirect evidence cannot become a verified credential without review.
      requiresConfirmation: item.requiresConfirmation || item.evidenceLevel !== "direct",
    }));
  const verifiedRequirements = generated.requirements.map(requirement => {
    if (requirement.evidence === "missing") {
      return { ...requirement, sourceQuote: "" };
    }
    if (!quoteExists(sourceText, requirement.sourceQuote)) {
      return { ...requirement, evidence: "ambiguous" as const, sourceQuote: "" };
    }
    return requirement;
  });
  return {
    ...generated.resume,
    suggestions: verifiedSuggestions.map(item => ({ ...item, requiresReview: true })),
    requirements: verifiedRequirements,
    missingRequirements: generated.missingRequirements,
    clarificationQuestions: generated.clarificationQuestions.filter(
      item => !item.requirementId || requirementIds.has(item.requirementId)
    ),
    writingNotes: [...new Set([...generated.writingNotes, ...auditResumeWriting(resumeProse(generated.resume))])],
    requiresReview: true,
  };
}
