import { expect, test } from 'bun:test'
import { applyApprovedChanges } from './reviewChanges'
import type { TailoringResponse } from './schemas'

const sample: TailoringResponse = {
 optimizationMode: 'conservative',
 inputValue: { fullName: 'Alex Example', summary: 'Assisted customers' },
 fields: { experience: [{ companyName: 'Retail Store', jobSummary: 'Updated inventory' }] },
 tagFields: {},
 suggestions: [{
  section: 'experience',
  target: { section: 'fields', key: 'experience', index: 0, field: 'jobSummary' },
  sourceQuote: 'Updated inventory',
  original: 'Updated inventory',
  proposed: 'Maintained retail inventory records',
  reason: 'Clearer context',
  priority: 'medium',
  changeType: 'rewrite',
  requirementId: 'inventory',
  evidenceLevel: 'direct',
  requiresConfirmation: true,
 }],
 requirements: [],
 missingRequirements: [],
 clarificationQuestions: [],
 writingNotes: [],
 requiresReview: true,
}

test('reject-all keeps the baseline unchanged', () => {
 const result = applyApprovedChanges(sample, new Set())
 expect(result.fields.experience?.[0]?.jobSummary).toBe('Updated inventory')
 expect(sample.fields.experience?.[0]?.jobSummary).toBe('Updated inventory')
})

test('accepting one anchored edit changes only the target', () => {
 const result = applyApprovedChanges(sample, new Set([0]))
 expect(result.fields.experience?.[0]?.jobSummary).toBe('Maintained retail inventory records')
 expect(result.fields.experience?.[0]?.companyName).toBe('Retail Store')
 expect(sample.fields.experience?.[0]?.jobSummary).toBe('Updated inventory')
})

test('a stale original string is never overwritten', () => {
 const stale = { ...sample, fields: { experience: [{ jobSummary: 'Manually corrected experience' }] } }
 const result = applyApprovedChanges(stale, new Set([0]))
 expect(result.fields.experience?.[0]?.jobSummary).toBe('Manually corrected experience')
})


test('approved experience bullet changes only the selected bullet', () => {
 const baseline: TailoringResponse = {
  ...sample,
  tagFields: { 'jobHighlights-0': { tags: ['Built Node.js APIs', 'Updated inventory'], input:'', suggestions:[] } },
  suggestions: [{ ...sample.suggestions[0]!,
   target: { section:'tagFields', key:'jobHighlights-0', index:0, field:'tags' },
   original:'Built Node.js APIs', proposed:'Developed backend APIs with Node.js',
  }],
 }
 const approved = applyApprovedChanges(baseline, new Set([0]))
 expect(approved.tagFields?.['jobHighlights-0']?.tags).toEqual(['Developed backend APIs with Node.js', 'Updated inventory'])
 expect(baseline.tagFields?.['jobHighlights-0']?.tags[0]).toBe('Built Node.js APIs')
 expect(applyApprovedChanges(baseline, new Set()).tagFields?.['jobHighlights-0']?.tags[0]).toBe('Built Node.js APIs')
})
