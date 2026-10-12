import { describe, expect, test } from 'bun:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ResumeDocument from './ResumeDocument'
import { sampleForTemplate } from './sampleResume'
import { resumeTemplates } from './registry'

describe('five image references — HTML contract and editorial comparison',()=>{
 for(const ref of resumeTemplates){
  test(`${ref.name}: renders sample details and reference-specific structure`,()=>{
   const html=renderToStaticMarkup(createElement(ResumeDocument,{
    template:ref.id,snapshot:sampleForTemplate(ref.id),
   }))
   expect(html).toContain(`rs-template-${ref.id}`)
   expect(html).toContain('resume-header')
   expect(html).toContain('resume-section')
   expect(html).toContain('Professional')
   expect(html).toContain('Education')
   expect(html).not.toContain('undefined')
   expect(html).not.toContain('javascript:')
  })
 }
 test('Gregory Wade — dark portrait rail and career summary',()=>{
  const html=renderToStaticMarkup(createElement(ResumeDocument,{template:'executive',snapshot:sampleForTemplate('executive')}))
  expect(html).toContain('rs-charcoal')
  expect(html).toContain('rs-portrait')
  expect(html).toContain('Career Summary')
  expect(html).toContain('rs-sidebar-contact')
 })
 test('Anna McDonald — editorial ATS single column',()=>{
  const html=renderToStaticMarkup(createElement(ResumeDocument,{template:'classic',snapshot:sampleForTemplate('classic')}))
  expect(html).toContain('rs-single')
  expect(html).toContain('Professional Overview')
  expect(html).not.toContain('rs-sidebar')
 })
 test('Riley Cooper — broad header and stone information rail',()=>{
  const html=renderToStaticMarkup(createElement(ResumeDocument,{template:'modern',snapshot:sampleForTemplate('modern')}))
  expect(html).toContain('rs-stone')
  expect(html).toContain('Core Skills')
  expect(html.indexOf('resume-header')).toBeLessThan(html.indexOf('rs-stone'))
 })
 test('Mark Williams — navy header and information rail',()=>{
  const html=renderToStaticMarkup(createElement(ResumeDocument,{template:'executive-modern',snapshot:sampleForTemplate('executive-modern')}))
  expect(html).toContain('rs-navy')
  expect(html).toContain('rs-monogram')
  expect(html).toContain('rs-sidebar-contact')
 })
 test('Sophia Evans — monochrome ATS single column',()=>{
  const html=renderToStaticMarkup(createElement(ResumeDocument,{template:'ats-essential',snapshot:sampleForTemplate('ats-essential')}))
  expect(html).toContain('rs-single')
  expect(html).toContain('Work Experience')
  expect(html).not.toContain('rs-sidebar')
 })
})
