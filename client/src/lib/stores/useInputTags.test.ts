import { test, expect } from 'bun:test'
import { useTagStore } from './useInputTags'

const empty = (tags: string[]) => ({tags,input:'',suggestions:[]})

test('deleting an earlier job shifts its achievements without attaching the wrong facts', () => {
  const store = useTagStore.getState()
  store.setTags({
    'jobHighlights-0': empty(['Owned the login flow']),
    'jobHighlights-1': empty(['Reduced customer wait time']),
    'jobHighlights-2': empty(['Improved documentation']),
    'skills-0': empty(['TypeScript']),
  })
  store.shiftIndexedTags('jobHighlights', 0, 'remove')
  const after = useTagStore.getState().fields
  expect(after['jobHighlights-0'].tags).toEqual(['Reduced customer wait time'])
  expect(after['jobHighlights-1'].tags).toEqual(['Improved documentation'])
  expect(after['jobHighlights-2']).toBeUndefined()
  expect(after['skills-0'].tags).toEqual(['TypeScript'])
})

test('inserting a new record shifts following tags and retains existing details', () => {
  const store=useTagStore.getState()
  store.setTags({'projectHighlights-0':empty(['Implemented checkout']),'projectHighlights-1':empty(['Built storefront'])})
  store.shiftIndexedTags('projectHighlights',0,'insert')
  const after=useTagStore.getState().fields
  expect(after['projectHighlights-0'].tags).toEqual(['Implemented checkout'])
  expect(after['projectHighlights-1']).toBeUndefined()
  expect(after['projectHighlights-2'].tags).toEqual(['Built storefront'])
})

test('removing a project moves technologies and AI-generated highlights together', () => {
 const state=useTagStore.getState()
 state.setTags({
  'projectHighlights-0':empty(['Real result A']),
  'projectHighlights-1':empty(['Real result B']),
  'projectTechnologies-0':empty(['TypeScript']),
  'projectTechnologies-1':empty(['Go']),
 })
 state.shiftIndexedTags('projectHighlights',0,'remove')
 state.shiftIndexedTags('projectTechnologies',0,'remove')
 const values=useTagStore.getState().fields
 expect(values['projectHighlights-0'].tags).toEqual(['Real result B'])
 expect(values['projectTechnologies-0'].tags).toEqual(['Go'])
 expect(values['projectHighlights-1']).toBeUndefined()
 expect(values['projectTechnologies-1']).toBeUndefined()
})
