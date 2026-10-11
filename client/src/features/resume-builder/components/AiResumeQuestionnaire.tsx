import { useState } from 'react'
import { ArrowLeft, ArrowRight, Plus, Sparkles, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { builderResponseSchema, type BuilderResponse } from '@/features/resume-tailor/schemas'

type Experience = {
  company: string
  position: string
  startDate: string
  endDate: string
  responsibilities: string
}
type Education = {
  institution: string
  degree: string
  dates: string
}
type Project = { name: string; description: string }
type CareerLevel = 'student' | 'entry' | 'mid' | 'senior'

interface Answers {
  fullName: string
  email: string
  phone: string
  location: string
  targetRole: string
  careerLevel: CareerLevel
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: string
  additionalInfo: string
}

interface QuestionnaireProps {
  /** Applies the resulting draft to the existing editor, without creating a second resume store. */
  onDraft: (draft: BuilderResponse) => void
  onClose: () => void
}

const initialAnswers: Answers = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  targetRole: '',
  careerLevel: 'entry',
  experience: [],
  education: [],
  projects: [],
  skills: '',
  additionalInfo: '',
}

const responseSchema = z.object({
  data: builderResponseSchema,
})

const fieldClass = 'mt-2 w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-offset-2'
const fieldStyle = { borderColor: 'var(--rs-line)' }

/**
 * Optional four-step flow that captures candidate facts in everyday language.
 * Work history is optional; students can describe projects or education instead.
 */
export default function AiResumeQuestionnaire({ onDraft, onClose }: QuestionnaireProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [draft,setDraft] = useState<BuilderResponse|null>(null)

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers(current => ({ ...current, [key]: value }))
  }

  function updateItem<K extends 'experience' | 'education' | 'projects'>(
    section: K,
    index: number,
    field: string,
    value: string,
  ) {
    setAnswers(current => ({
      ...current,
      [section]: current[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  function removeItem(section: 'experience' | 'education' | 'projects', index: number) {
    setAnswers(current => ({
      ...current,
      [section]: current[section].filter((_, i) => i !== index),
    }))
  }

  /**
   * The server owns authoritative Zod validation.
   * The client only validates essential fields to give immediate feedback.
   */
  async function generateResume() {
    setError('')
    if (answers.fullName.trim().length < 2 || answers.targetRole.trim().length < 2) {
      setError('Enter your name and the role you are targeting.')
      setStep(0)
      return
    }
    if (!answers.experience.length && !answers.education.length &&
        !answers.projects.length && !answers.skills.trim()) {
      setError('Add some experience, education, projects or skills so AI has facts to work with.')
      return
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_DEVELOPMENT_BACKEND_URL
    if (!backendUrl) {
      setError('AI generation is not configured for this environment.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${backendUrl}/api/v1/resumes/ai-build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          skills: answers.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        }),
      })

      const raw: unknown = await response.json()
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('You have reached the AI Builder quota for this five-hour window.')
        }
        throw new Error('Unable to generate your resume right now. Please check your details and retry.')
      }

      const parsed = responseSchema.safeParse(raw)
      if (!parsed.success) throw new Error('The server returned an invalid resume draft.')

      // The parent applies draft data to the existing editor. No independent AI store.
      // Present review metadata before committing any AI proposal to the editor.
      setDraft(parsed.data.data)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const next = () => {
    setError('')
    if (step === 0 && (answers.fullName.trim().length < 2 || answers.targetRole.trim().length < 2)) {
      setError('Your name and target role are required.')
      return
    }
    setStep(current => Math.min(3, current + 1))
  }

  return (
    <section className="rs-card mb-8 p-5 md:p-8" aria-label="AI resume questionnaire">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="rs-eyebrow" style={{ color: 'var(--rs-muted)' }}>Optional AI assistant</p>
          <h2 className="rs-editorial mt-2 text-3xl md:text-4xl">Tell us your story.</h2>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--rs-muted)' }}>
            Answer a few questions. AI will help draft your resume; you can edit everything afterward.
          </p>
        </div>
        <button className="rs-button rs-button-outline" onClick={onClose} type="button" disabled={loading}>Close</button>
      </div>
      <div className="mb-6 flex gap-2" aria-label={`Step ${step + 1} of 4`}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: i <= step ? 'var(--rs-ink)' : 'var(--rs-line)' }} />
        ))}
      </div>
      {draft&&<div className="mb-6 space-y-4 rounded-xl border p-4" style={{borderColor:'var(--rs-line)'}}><h3 className="text-lg font-semibold">Review your AI draft</h3><p className="text-sm">Generated summary: {draft.inputValue.summary}</p>{draft.writingNotes.map((note,i)=><p key={i} className="text-xs">{note}</p>)}{draft.clarificationQuestions.length>0&&<div><h4 className="text-sm font-semibold">Questions that could improve your resume</h4>{draft.clarificationQuestions.map((q,i)=><p className="mt-2 text-xs" key={i}>{q.question} — {q.reason}</p>)}</div>}<p className="text-xs">AI wording is unverified. Check claims in the editor before using the resume.</p><div className="flex flex-wrap gap-2"><button type="button" className="rs-button rs-button-primary" onClick={()=>onDraft(draft)}>Accept draft and edit</button><button type="button" className="rs-button rs-button-outline" onClick={()=>setDraft(null)}>Return to answers</button></div></div>}
      {!draft&&<form onSubmit={event => { event.preventDefault(); if (step < 3) next(); else void generateResume() }}>
        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">Full name *<input className={fieldClass} style={fieldStyle}
              value={answers.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Your full name" /></label>
            <label className="text-sm">Role you're targeting *<input className={fieldClass} style={fieldStyle}
              value={answers.targetRole} onChange={e => update('targetRole', e.target.value)} placeholder="e.g. Operations Associate" /></label>
            <label className="text-sm">Email<input type="email" className={fieldClass} style={fieldStyle}
              value={answers.email} onChange={e => update('email', e.target.value)} placeholder="name@example.com" /></label>
            <label className="text-sm">Phone<input className={fieldClass} style={fieldStyle}
              value={answers.phone} onChange={e => update('phone', e.target.value)} placeholder="Phone number" /></label>
            <label className="text-sm">Location<input className={fieldClass} style={fieldStyle}
              value={answers.location} onChange={e => update('location', e.target.value)} placeholder="City, country" /></label>
            <label className="text-sm">Career level
              <select className={fieldClass} style={{ ...fieldStyle, backgroundColor: 'var(--rs-surface)' }}
                value={answers.careerLevel} onChange={e => update('careerLevel', e.target.value as CareerLevel)}>
                <option value="student">Student / new graduate</option>
                <option value="entry">Entry level</option>
                <option value="mid">Experienced professional</option>
                <option value="senior">Senior professional</option>
              </select>
            </label>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold">Work experience</h3>
            <p className="mt-1 mb-5 text-sm" style={{ color: 'var(--rs-muted)' }}>
              Include previous roles, internships or volunteering. Skip if you have no experience yet.
            </p>
            <div className="space-y-4">
              {answers.experience.map((item, index) => (
                <div key={index} className="rounded-xl border p-4" style={{ borderColor: 'var(--rs-line)' }}>
                  <div className="grid gap-3 md:grid-cols-2">
                    {([
                      ['company', 'Employer / organization'],
                      ['position', 'Your role'],
                      ['startDate', 'Start date'],
                      ['endDate', 'End date / Present'],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="text-sm">{label}
                        <input className={fieldClass} style={fieldStyle} value={item[key]}
                          onChange={e => updateItem('experience', index, key, e.target.value)} />
                      </label>
                    ))}
                  </div>
                  <label className="mt-3 block text-sm">What did you do? Describe it in your own words.
                    <textarea className={fieldClass} style={fieldStyle} rows={4}
                      value={item.responsibilities}
                      onChange={e => updateItem('experience', index, 'responsibilities', e.target.value)} />
                  </label>
                  <button className="mt-4 flex items-center gap-2 text-xs" type="button"
                    onClick={() => removeItem('experience', index)}><Trash2 size={14}/> Remove role</button>
                </div>
              ))}
            </div>
            <button type="button" className="rs-button rs-button-outline mt-4"
              onClick={() => update('experience', [
                ...answers.experience,
                { company: '', position: '', startDate: '', endDate: '', responsibilities: '' },
              ])}><Plus size={16}/> Add a role</button>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-8 md:grid-cols-2">
            <section>
              <h3 className="text-lg font-semibold">Education</h3>
              {answers.education.map((item, index) => (
                <div key={index} className="mt-4 space-y-3 rounded-xl border p-4" style={{ borderColor: 'var(--rs-line)' }}>
                  {([
                    ['institution', 'School / university'],
                    ['degree', 'Degree / qualification'],
                    ['dates', 'Year completed or expected'],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="block text-sm">{label}
                      <input className={fieldClass} style={fieldStyle} value={item[key]}
                        onChange={e => updateItem('education', index, key, e.target.value)} />
                    </label>
                  ))}
                  <button type="button" className="flex items-center gap-2 text-xs"
                    onClick={() => removeItem('education', index)}><Trash2 size={14}/> Remove</button>
                </div>
              ))}
              <button className="rs-button rs-button-outline mt-4" type="button"
                onClick={() => update('education', [...answers.education, { institution: '', degree: '', dates: '' }])}>
                <Plus size={16}/> Add education
              </button>
            </section>
            <section>
              <h3 className="text-lg font-semibold">Projects</h3>
              {answers.projects.map((item, index) => (
                <div key={index} className="mt-4 space-y-3 rounded-xl border p-4" style={{ borderColor: 'var(--rs-line)' }}>
                  <label className="block text-sm">Project name
                    <input className={fieldClass} style={fieldStyle} value={item.name}
                      onChange={e => updateItem('projects', index, 'name', e.target.value)} />
                  </label>
                  <label className="block text-sm">What did you create or contribute?
                    <textarea className={fieldClass} style={fieldStyle} rows={3}
                      value={item.description}
                      onChange={e => updateItem('projects', index, 'description', e.target.value)} />
                  </label>
                  <button type="button" className="flex items-center gap-2 text-xs"
                    onClick={() => removeItem('projects', index)}><Trash2 size={14}/> Remove</button>
                </div>
              ))}
              <button className="rs-button rs-button-outline mt-4" type="button"
                onClick={() => update('projects', [...answers.projects, { name: '', description: '' }])}>
                <Plus size={16}/> Add project
              </button>
            </section>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            <label className="text-sm">Your skills (separate with commas)
              <textarea rows={3} className={fieldClass} style={fieldStyle} value={answers.skills}
                onChange={e => update('skills', e.target.value)}
                placeholder="e.g. Customer service, Excel, Inventory management" />
            </label>
            <label className="text-sm">Anything else worth mentioning? (optional)
              <textarea rows={4} className={fieldClass} style={fieldStyle} value={answers.additionalInfo}
                onChange={e => update('additionalInfo', e.target.value)}
                placeholder="Achievements, volunteering, certifications or background details..." />
            </label>
            <p className="text-xs leading-6" style={{ color: 'var(--rs-muted)' }}>
              AI may improve the wording, but it cannot verify every fact. Review your draft before sending applications.
              Answers are sent to the resume-generation service for processing.
            </p>
          </div>
        )}

        {!!error && <p role="alert" className="mt-5 text-sm text-red-500">{error}</p>}
        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button type="button" className="rs-button rs-button-outline" disabled={step === 0 || loading}
            onClick={() => { setError(''); setStep(current => Math.max(0, current - 1)) }}>
            <ArrowLeft size={16}/> Previous
          </button>
          <button type="submit" className="rs-button rs-button-primary" disabled={loading}>
            {step === 3 ? <Sparkles size={16}/> : <ArrowRight size={16}/>}
            {loading ? 'Writing your draft…' : step === 3 ? 'Build my resume with AI' : 'Continue'}
          </button>
        </div>
      </form>}
    </section>
  )
}
