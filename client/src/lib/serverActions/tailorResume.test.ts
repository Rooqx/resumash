import { expect, test } from 'bun:test'
import { createTailorJobCredentials } from './tailorResume'

test('anonymous capability uses cryptographically random IDs and 256-bit tokens', () => {
 const first=createTailorJobCredentials()
 const second=createTailorJobCredentials()
 expect(first.jobId).toMatch(/^[0-9a-f-]{36}$/)
 expect(first.token).toMatch(/^[0-9a-f]{64}$/)
 expect(first.token).not.toBe(second.token)
 expect(first.jobId).not.toBe(second.jobId)
 expect(first.submittedAt).toBeGreaterThan(0)
})
