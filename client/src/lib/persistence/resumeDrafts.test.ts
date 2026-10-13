import { expect, test } from 'bun:test'
import { clearTailorDraft, restoreTailorDraft, saveTailorDraft, restoreBuilderView, saveBuilderView, clearBuilderDraft } from './resumeDrafts'

/** Local storage simulation tests refresh restoration without a browser session. */
const store = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', {
 configurable: true,
 value: {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => {store.set(key, value)},
  removeItem: (key: string) => {store.delete(key)},
 },
})

test('restore job text, selected review, and view after refresh', () => {
 const draft = {version:1 as const,jobDescription:'Sample hiring role',result:null,approved:true,acceptedEdits:[0,2],view:'comparison' as const,optimizationMode:'full' as const}
 expect(saveTailorDraft(draft)).toBe(true)
 expect(restoreTailorDraft()).toEqual(draft)
 clearTailorDraft()
 expect(restoreTailorDraft()).toBeNull()
})

test('restore selected editor step/template and clear personal builder work', () => {
 expect(saveBuilderView({active:3,template:'executive'})).toBe(true)
 expect(restoreBuilderView()).toEqual({active:3,template:'executive'})
 store.set('resumash:builder:inputs:v1', '{"personal":"data"}')
 store.set('resumash:builder:questionnaire:v1', '{"personal":"data"}')
 clearBuilderDraft()
 expect(restoreBuilderView()).toBeNull()
 expect(store.has('resumash:builder:inputs:v1')).toBe(false)
 expect(store.has('resumash:builder:questionnaire:v1')).toBe(false)
})

test('corrupted local draft data never crashes restoration', () => {
 store.set('resumash:tailor:v1','{corrupt')
 expect(restoreTailorDraft()).toBeNull()
 clearTailorDraft()
})


test('a modified source is tracked across refresh to prevent comparing old results with new inputs', () => {
 const draft = { version:1 as const, jobDescription:'Modified job description', result:null, approved:false, acceptedEdits:[], view:'tailored' as const, optimizationMode:'conservative' as const, sourceDirty:true }
 expect(saveTailorDraft(draft)).toBe(true)
 expect(restoreTailorDraft()?.sourceDirty).toBe(true)
 clearTailorDraft()
})
