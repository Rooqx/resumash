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
