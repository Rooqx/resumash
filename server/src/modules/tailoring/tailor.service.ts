import { AppError } from "../../middlewares/error.middleware";
import { generateJson } from "../../shared/ai/generate-json";
import { parseResumePdf } from "../resume/parse-pdf";
import { TAILOR_INSTRUCTIONS, TAILOR_FULL_INSTRUCTIONS } from "./tailor.prompt";
import type { OptimizationMode } from "./optimization-mode";
import { tailoringResultSchema } from "./tailor.schema";
import { validatedReviewSuggestions } from "./review-target";
import { assertBaselineProseSupported } from "./baseline-evidence";
import { assertNumericalClaimsSupported } from "../../shared/ai/numeric-evidence";
import { assertSourceEntitiesPreserved } from "../../shared/ai/source-entities";
import { auditResumeWriting, resumeProse } from "../../shared/ai/writing-quality";

/**
 * Verify a cited quote exists in the original candidate document.
 * A model's citation is untrusted until checked against the source.
 */
function quoteExists(source: string, quote: string): boolean {
  const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();
  return normalize(source).includes(normalize(quote));
}

/**
 * Returns a legacy-compatible resume and review metadata.
 * All claims still require candidate review; structural validation and
 * numeric checks reduce mistakes but cannot prove semantic truth.
 */
export async function tailorResume(file: Buffer, jobDescription: string, optimizationMode: OptimizationMode = "full") {
  const sourceText = await parseResumePdf(file);
  return tailorResumeFromText(sourceText, jobDescription, optimizationMode);
}

/** Runs in a background worker on already extracted PDF text. */
export async function tailorResumeFromText(sourceText: string, jobDescription: string, optimizationMode: OptimizationMode = "full") {
  const generated = await generateJson(
    optimizationMode === "full" ? TAILOR_FULL_INSTRUCTIONS : TAILOR_INSTRUCTIONS,
    { candidateResume: sourceText, jobDescription },
    tailoringResultSchema,
    // Temporary diagnostic: one Atria attempt of up to 5 minutes.
    // No retry, so a 5-minute failure is unambiguously one timed-out request.
    { timeoutMs: 300_000, maxRetries: 0 },
  );

  assertNumericalClaimsSupported(sourceText, resumeProse(generated.resume));
  // The proposed change is never applied server-side; validate its numeric claims too.
  assertNumericalClaimsSupported(sourceText, generated.suggestions.map(item => item.proposed));
  assertSourceEntitiesPreserved(sourceText, generated.resume.fields);
  if (optimizationMode === "conservative") assertBaselineProseSupported(sourceText, generated.resume);
  else assertTailoredSkillTagsSupported(sourceText, generated.resume);
  // Each review suggestion must refer to a distinct, real job requirement.
  const requirementIds = new Set(generated.requirements.map(item => item.id));
  if (requirementIds.size !== generated.requirements.length) {
    throw new AppError("AI returned duplicate requirement references", 502);
  }
  // Never show a fabricated evidence quote as though it came from the PDF.
  // A related or ambiguous claim stays review-required rather than verified.
  const verifiedSuggestions = validatedReviewSuggestions(generated, sourceText)
    .filter(item => !item.requirementId || requirementIds.has(item.requirementId));

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
    optimizationMode,
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


/**
 * Full mode must never add requested job-listing skills unsupported by the
 * candidate's resume. Accept equivalent punctuation (NextJs vs Next.js).
 * Plain category labels do not themselves claim proficiency.
 */
export function assertTailoredSkillTagsSupported(
  source: string,
  resume: { fields: Record<string, Array<Record<string, unknown>>>; tagFields?: Record<string, { tags: string[] }> },
): void {
  const compact = (s: string) => s.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  const haystack = compact(source);
  const category = /^(languages|programming languages|frameworks|libraries|frontend|backend|web development|databases|data & storage|cloud & infrastructure|cloud|devops|infrastructure|tools|testing|testing & quality|data engineering|data & analytics|apis & integrations|other skills|technical skills)$/i;
  for (const [index, entry] of (resume.fields.skills ?? []).entries()) {
    const name = typeof entry.skillName === "string" ? entry.skillName.trim() : "";
    const tags = resume.tagFields?.[`skills-${index}`]?.tags ?? [];
    for (const skill of [...tags, ...(tags.length === 0 && name && !category.test(name) ? [name] : [])]) {
      const needle = compact(skill);
      if (needle.length >= 3 && !haystack.includes(needle)) {
        throw new AppError("AI returned a skill not clearly supported by the uploaded resume", 502);
      }
    }
  }
}
