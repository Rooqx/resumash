import { describe, expect, test } from 'bun:test'
import { orderedResumeSections, templateConfigs, sectionKeys } from './templateConfig'
import { resumeTemplates } from './registry'

describe('shared resume template contract', () => {
 for (const template of resumeTemplates) {
  test(`${template.name} has unique, known sections`, () => {
   const sections=orderedResumeSections(template.id)
   expect(sections.length).toBe(sectionKeys.length)
   expect(new Set(sections).size).toBe(sections.length)
   expect([...sections].sort()).toEqual([...sectionKeys].sort())
   expect(templateConfigs[template.id].pagePadding.horizontal).toBeGreaterThan(30)
  })
 }
 test('graduate profile prioritizes education and projects over employment',()=>{
  const sections=orderedResumeSections('classic')
  expect(sections.indexOf('education')).toBeLessThan(sections.indexOf('experience'))
  expect(sections.indexOf('projects')).toBeLessThan(sections.indexOf('experience'))
 })
 test('recruiter standard prioritizes experience over projects and education',()=>{
  const sections=orderedResumeSections('modern')
  expect(sections.indexOf('experience')).toBeLessThan(sections.indexOf('projects'))
  expect(sections.indexOf('experience')).toBeLessThan(sections.indexOf('education'))
 })
 test('leadership profile prioritizes executive narrative and experience',()=>{
  expect(orderedResumeSections('executive').slice(0,2)).toEqual(['summary','experience'])
  expect(templateConfigs.executive.summaryTitle).toBe('Leadership Profile')
 })
})
