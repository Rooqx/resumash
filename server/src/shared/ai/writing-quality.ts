/**
 * Deterministic writing diagnostics for AI-generated resume content.
 *
 * This is intentionally a small heuristic—not an AI detector and not a
 * factual-verification engine. It flags patterns for human review; it never
 * removes a real candidate statement solely because of a matching phrase.
 */
const EMPTY_PHRASES = [
  /\bresults-driven\b/i,
  /\bdynamic professional\b/i,
  /\bcutting-edge\b/i,
  /\bproven track record\b/i,
  /\bspearheaded transformative\b/i,
  /\bdrive(?:s|n)? excellence\b/i,
  /\bleverag(?:ed|ing) innovative\b/i,
  /\bsynerg(?:y|ies)\b/i,
];

const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * @param content - AI-written summary, bullet points, and descriptions.
 * @returns Actionable observations; never a pseudo ATS or AI-detection score.
 */
export function auditResumeWriting(content: string[]): string[] {
  const notes = new Set<string>();
  const seen = new Set<string>();
  let repeated = 0;
  for (const value of content) {
    const sentence = normalize(value);
    if (!sentence) continue;
    if (seen.has(sentence)) repeated++;
    seen.add(sentence);
    if (EMPTY_PHRASES.some(pattern => pattern.test(sentence))) {
      notes.add("Replace generic promotional language with specific, evidenced work.");
    }
    if (/\b(?:successfully|effectively|efficiently)\b/i.test(sentence)) {
      notes.add("Remove unnecessary adverbs where the actual action already explains the contribution.");
    }
    if (sentence.length > 350) {
      notes.add("Shorten overly long resume statements for easier scanning.");
    }
  }
  if (repeated) notes.add("Remove repeated bullets; each statement should add distinct evidence.");
  return [...notes];
}

/** Inspect only fields that represent rewritten prose, not candidate IDs or dates. */
export function resumeProse(resume: {
  inputValue: Record<string, string>;
  fields: Record<string, Array<Record<string, unknown>>>;
  tagFields?: Record<string, { tags: string[] }>;
}): string[] {
  const prose = [resume.inputValue.summary ?? ""];
  for (const [section, records] of Object.entries(resume.fields)) {
    for (const row of records) {
      for (const [key, value] of Object.entries(row)) {
        if (typeof value !== "string") continue;
        if (section === "experience" && key === "jobSummary") prose.push(value);
        if (section === "projects" && key === "description") prose.push(value);
        if (section === "awards" && key === "awardSummary") prose.push(value);
      }
    }
  }
  for (const [key, item] of Object.entries(resume.tagFields ?? {})) {
    if (key.startsWith("jobHighlights-") || key.startsWith("projectHighlights-")) {
      prose.push(...item.tags);
    }
  }
  return prose;
}
