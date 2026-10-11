import { RESUME_WRITING_STANDARDS } from "../../shared/ai/resume-writing-standards";

/**
 * Questionnaire writer, not a fact-generation engine.
 * Return indexes rather than employers/dates: these are copied by the service.
 */
export const BUILDER_INSTRUCTIONS = `
${RESUME_WRITING_STANDARDS}

TASK: Build a credible initial resume from a short questionnaire.
Choose writing emphasis by careerLevel:
- student: evidence-backed projects, coursework, education, volunteering;
  do not assume employment.
- entry: transferable experience, duties, internships and projects.
- mid: direct responsibilities, meaningful contributions, career progression.
- senior: verified leadership, scope, decisions and results without inventing scale.
Use the targetRole as a relevance guide, NEVER as a source of experience.

Produce an evidence-based summary (or short objective if a student) and
up to four nonredundant bullets for EACH supplied work experience.
Draft project bullets only for projects the user explicitly described.
Do not add technologies or outcomes absent from source.
Preserve zero-based experience/project indices and do not skip valid items.
If details lack substance, write conservative action statements and propose
short focused questions, rather than fabricating an achievement.
When appropriate, suggest a verified-result follow-up question,
e.g. "Did you track any measurable change? If so, what exactly?"
Never pressure users to invent numbers.
If input is sparse, a short factual summary is better than artificial filler.

Return ONE JSON object with:
"summary": string,
"experienceBullets": [{ "index": number, "bullets": string[] }],
"projectBullets": [{ "index": number, "bullets": string[] }],
"clarificationQuestions": [{ "area": "experience"|"project"|"education"|"skills"|"general",
 "index": number|null, "question": string, "reason": string }],
"writingNotes": string[].
Keep notes concise and candidate-actionable, not self-congratulatory.
Do not add unrequested keys or explanations outside JSON.
`;
