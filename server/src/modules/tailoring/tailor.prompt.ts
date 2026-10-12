import { RESUME_WRITING_STANDARDS } from "../../shared/ai/resume-writing-standards";

/**
 * Selective, evidence-led tailoring. JSON keys track the schema consumed by
 * the existing frontend; review findings are additional non-breaking metadata.
 */
export const TAILOR_INSTRUCTIONS = `
${RESUME_WRITING_STANDARDS}

TASK: Produce a conservative, faithful structured TRANSCRIPTION of the\nsupplied candidate resume as resume. Do NOT pre-apply suggestions.\nEvery prose string in resume (summary, jobSummary, project description,\nexperience/project highlight tags) MUST be a verbatim excerpt from candidateResume\nexcept whitespace and punctuation normalization; if not directly present, use\nan empty string or omit the optional field. Never synthesize baseline prose.\nThen recommend selective changes to the supplied candidate resume for the supplied job posting,
while preserving the candidate's actual background and voice.
Analyze the job requirements as essential, preferred or contextual.
For each important qualification, assess evidence as:
DIRECT (explicit candidate claim), RELATED (transferable but not equivalent),
AMBIGUOUS (insufficient detail), or MISSING (not found).
A job description is never evidence that the candidate has a skill.
Prioritize supported requirements, not raw keyword frequency.

RESUME OUTPUT (legacy-compatible)
"resume": {
 "inputValue": { "fullName":"","label":"","email":"","phone":"",
 "city":"","country":"","linkdlnUrl":"","githubUrl":"","portfolioUrl":"",
 "summary":"" },
 "fields": {
  "experience": [{ "companyName":"","jobPosition":"","jobStartDate":"",
                   "jobEndDate":"","jobSummary":"" }],
  "education": [{ "institution":"","studyType":"","area":"",
                  "startDate":"","endDate":"" }],
  "skills": [{ "skillName":"" }],
  "projects": [{ "name":"","description":"","url":"" }],
  "certificates": [{ "certificateName":"","certificateIssuer":"",
                      "certificateDate":"" }],
  "awards": [{ "awardTitle":"","awarder":"","awardDate":"",
               "awardSummary":"" }]
 },
 "tagFields": { "jobHighlights-0": { "tags":[], "input":"",
                                  "suggestions":[] },
                "skills-0": { "tags":[], "input":"",
                              "suggestions":[] } }
}
Use only real entries; empty arrays for absent sections.
Each tagFields index MUST refer to the corresponding experience/skills index.
Do not erase truthful but less-relevant work, rename actual job titles, or
replace the person's professional identity with the target title.
Preserve source contacts, employers, titles, dates and credentials.
Never invent metrics or amplify responsibility.
Preserve already-strong phrases rather than rewriting everything.\nDo not optimize baseline resume based on the job; only suggestions may tailor it.

REVIEW OUTPUT
"suggestions": up to 15 individually reviewable, supported changes:\nEach suggestion must target ONE existing plain-text field in the baseline resume.\nUse a target object { "section": "inputValue"|"fields", "key": string,\n"index": number (fields only), "field": string (fields only) }.\nFor inputValue, key is "summary"; omit index/field.\nFor fields, key must be "experience" or "projects"; field is\n"jobSummary" for experience or "description" for projects.\n"original" MUST exactly match the ENTIRE baseline field value in resume.\n"proposed" MUST be the full replacement text; do not append unknown facts.\nIf a source bullet cannot be safely targeted, write a clarification question\ninstead. Never present an unapplied change as already included in resume.
 { "section":string, "target":{ "section":"fields", "key":"experience", "index":0, "field":"jobSummary" },\n "sourceQuote":string, "original":string,
 "proposed":string, "reason":string, "priority":"high"|"medium"|"low",
 "changeType":"rewrite"|"emphasize"|"reorder"|"clarify",
 "requirementId":string, "evidenceLevel":"direct"|"related"|"ambiguous",
 "requiresConfirmation":boolean }
sourceQuote must be a short VERBATIM quote from candidateResume;
use an empty suggestions list if no safe improvements exist.
Do not pretend a clarification is a verified fact. A proposed rewrite
must not claim more than the source supports.
"requirements": up to 25 entries with stable IDs:
 { "id":string, "requirement":string,
   "importance":"essential"|"preferred"|"contextual",
   "evidence":"direct"|"related"|"ambiguous"|"missing",
   "sourceQuote":string }
If evidence is missing, sourceQuote MUST be empty; if direct/related,
quote the candidate resume verbatim.
"missingRequirements": concise descriptions of absent requirements.
"clarificationQuestions": up to 8 targeted questions:
 { "requirementId":string, "question":string, "reason":string }
"writingNotes": a short array of honest, actionable observations.

Only insert naturally supported keywords; no forced quotas or duplicated lists.
Prioritize evidence, short readable bullets, appropriate career-level language,
real contributions and useful interviewing detail.
SCHEMA RULES: All top-level keys are required. Use [] for empty arrays, never null.
Each suggestion needs section, target, sourceQuote (8-500 characters), original
(max 750), proposed (max 750), reason (5-500), priority, changeType,
requirementId, evidenceLevel, and requiresConfirmation (boolean).
A target contains only section, key, and for fields index and field.
Return no more than 15 suggestions, 25 requirements, 15 missingRequirements,
8 clarificationQuestions, and 8 writingNotes.
Each requirement needs id, requirement (4-250 chars), importance, evidence,
and sourceQuote. Each clarification question needs requirementId,
question (12-350 chars) and reason (5-250 chars).
Do not invent absent summary or project details to fill fields.
No additional top-level keys or extra suggestion target keys.

Return JSON only, exactly these top-level keys:
resume, suggestions, requirements, missingRequirements,
clarificationQuestions, writingNotes.
`;
