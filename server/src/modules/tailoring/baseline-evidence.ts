import { AppError } from "../../middlewares/error.middleware";
import { resumeProse } from "../../shared/ai/writing-quality";

/**
 * Verify that the AI's "baseline" resume is a transcription, not an
 * unapproved rewrite. All substantive prose must be found in the source PDF.
 *
 * Normalization handles whitespace and common PDF punctuation differences.
 * This deliberately errs on the side of rejecting uncertain extraction.
 * It cannot prove semantic equivalence; edits remain opt-in and reviewed.
 */
export function assertBaselineProseSupported(
  sourceText: string,
  resume: Parameters<typeof resumeProse>[0],
): void {
  const normalize = (value: string) => value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const source = normalize(sourceText);
  for (const phrase of resumeProse(resume)) {
    const statement = normalize(phrase);
    if (!statement) continue;
    if (!source.includes(statement)) {
      throw new AppError(
        "AI baseline contains rewritten prose without clear source evidence",
        502,
      );
    }
  }
}
