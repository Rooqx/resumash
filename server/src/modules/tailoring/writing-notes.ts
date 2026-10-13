/**
 * Only advisory writingNotes are recoverable when a provider ignores its
 * requested array limit. Factual resume data and evidence must remain untouched.
 */
export const MAX_TAILORING_WRITING_NOTES = 8;
const MAX_NOTE_LENGTH = 250;

export function capValidWritingNotes(value: unknown): unknown {
  if (!Array.isArray(value) || value.length <= MAX_TAILORING_WRITING_NOTES) return value;
  // Never silently discard malformed notes just because they are past item 8.
  // Reject them using the normal strict Zod schema instead.
  if (!value.every(note => typeof note === "string" && note.length <= MAX_NOTE_LENGTH)) return value;
  return value.slice(0, MAX_TAILORING_WRITING_NOTES);
}

/** Give deterministic quality warnings priority, then append unique model notes. */
export function mergeTailoringWritingNotes(modelNotes: string[], auditNotes: string[]): string[] {
  return [...new Set([...auditNotes, ...modelNotes])].slice(0, MAX_TAILORING_WRITING_NOTES);
}
