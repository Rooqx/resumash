import type { TailoringResponse, TailoredResume } from './schemas'

type Suggestion = TailoringResponse['suggestions'][number]

/**
 * Build an immutable reviewed resume from the model's conservative baseline.
 * No AI changes are applied unless individually approved.
 * Every edit requires a full-field exact match to prevent stale/ambiguous edits.
 */
export function applyApprovedChanges(
  baseline: TailoringResponse,
  approvedIndices: ReadonlySet<number>,
): TailoredResume {
  const inputValue = { ...baseline.inputValue }
  const fields = structuredClone(baseline.fields)
  const tagFields = structuredClone(baseline.tagFields ?? {})
  const used = new Set<string>()
  baseline.suggestions.forEach((item: Suggestion, index: number) => {
    if (!approvedIndices.has(index)) return
    const { section, key, field, index: row } = item.target
    const identity = JSON.stringify(item.target)
    if (used.has(identity)) return
    used.add(identity)
    if (section === 'inputValue' && key === 'summary' && row === undefined && field === undefined) {
      if (inputValue.summary === item.original) inputValue.summary = item.proposed
      return
    }
    if (section === 'tagFields' && /^jobHighlights-\\d+$/.test(key) && field === 'tags' && row !== undefined && Number.isInteger(row) && row >= 0) {
      const bullets = tagFields[key]?.tags
      if (bullets && bullets[row] === item.original) bullets[row] = item.proposed
      return
    }
    if (section === 'fields' && row !== undefined && Number.isInteger(row) &&
      ((key === 'experience' && field === 'jobSummary') ||
       (key === 'projects' && field === 'description'))) {
      const entry = fields[key]?.[row]
      if (entry && entry[field] === item.original) entry[field] = item.proposed
    }
  })
  return { inputValue, fields, tagFields }
}
