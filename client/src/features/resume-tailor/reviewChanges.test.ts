import { expect, test } from 'bun:test'
import { applyApprovedChanges } from './reviewChanges'
import type { TailoringResponse } from './schemas'

const sample: TailoringResponse = {
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
