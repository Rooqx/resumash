import { describe, expect, test } from 'bun:test'
import { orderedResumeSections, mainResumeSections, sidebarResumeSections, templateConfigs, sectionKeys } from './templateConfig'
import { resumeTemplates, templateSchema } from './registry'

describe('five reference-driven resume template contracts', () => {
 test('all five gallery designs are distinct and registered', () => {
  expect(resumeTemplates).toHaveLength(5)
  expect(new Set(resumeTemplates.map(t=>t.id)).size).toBe(5)
  expect(new Set(resumeTemplates.map(t=>templateConfigs[t.id].layout)).size).toBe(5)
  expect(templateSchema.options).toContain('ats-essential')
  expect(templateSchema.options).toContain('executive-modern')
 })
 for(const template of resumeTemplates){
  test(`${template.name}: all sections appear exactly once across main and sidebar`,()=>{
   const sections=orderedResumeSections(template.id)
   expect(sections).toHaveLength(sectionKeys.length)
   expect(new Set(sections).size).toBe(sectionKeys.length)
   expect([...sections].sort()).toEqual([...sectionKeys].sort())
   const onPage=[...mainResumeSections(template.id),...sidebarResumeSections(template.id)]
   expect(onPage.sort()).toEqual([...sectionKeys].sort())
   expect(templateConfigs[template.id].pagePadding.horizontal).toBeGreaterThan(24)
  })
 }
 test('Gregory Wade: charcoal rail holds education and skills',()=>{
  expect(templateConfigs.executive.layout).toBe('charcoal-rail')
  expect(sidebarResumeSections('executive')).toEqual(['education','skills'])
  expect(templateConfigs.executive.summaryTitle).toBe('Career Summary')
 })
 test('Anna McDonald: ATS-friendly single-column corporate layout',()=>{
  expect(templateConfigs.classic.layout).toBe('editorial')
  expect(sidebarResumeSections('classic')).toEqual([])
  expect(mainResumeSections('classic')).toContain('skills')
 })
 test('Riley Cooper: stone rail separates supporting information from history',()=>{
  expect(templateConfigs.modern.layout).toBe('stone-rail')
  expect(sidebarResumeSections('modern')).toEqual(['education','skills','additional'])
 })
 test('Mark Williams: navy header and supporting rail',()=>{
  expect(templateConfigs['executive-modern'].layout).toBe('navy-banner')
  expect(sidebarResumeSections('executive-modern')).toEqual(['education','skills'])
 })
 test('Sophia Evans: single-column ATS-oriented document',()=>{
  expect(templateConfigs['ats-essential'].layout).toBe('monochrome')
  expect(sidebarResumeSections('ats-essential')).toEqual([])
  expect(mainResumeSections('ats-essential')[0]).toBe('summary')
 })
})
