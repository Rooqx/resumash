import { AppError } from "../../middlewares/error.middleware";

/**
 * Reject model-created organizations and qualifications that cannot be
 * located in the candidate's uploaded PDF text.
 *
 * This is a conservative lexical safeguard, not full semantic verification:
 * abbreviations and broken PDF text extraction may cause false rejections.
 * It deliberately validates identity-bearing facts rather than prose.
 */
export function assertSourceEntitiesPreserved(
  source: string,
  fields: Record<string, Array<Record<string, unknown>>>,
): void {
  const canonical = (text: string) =>
    text.toLowerCase().normalize("NFKC")
      .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
  const normalizedSource = canonical(source);
  const identities: Array<[string, string]> = [
    ["experience", "companyName"],
    ["education", "institution"],
    ["certificates", "certificateName"],
    ["certificates", "certificateIssuer"],
    ["awards", "awardTitle"],
  ];
  for (const [section, property] of identities) {
    for (const entry of fields[section] ?? []) {
      const value = entry[property];
      if (typeof value !== "string" || !value.trim()) continue;
      const candidate = canonical(value);
      if (candidate.length >= 3 && !normalizedSource.includes(candidate)) {
        throw new AppError(
          "AI returned an employer, school, or credential not clearly present in the resume",
          502,
        );
      }
    }
  }
}
