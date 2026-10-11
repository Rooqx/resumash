import type { Questionnaire } from "./ai-builder.schema";
import { resumeDraftSchema } from "./ai-builder.schema";
import { generateJson } from "../../shared/ai/generate-json";
import { BUILDER_INSTRUCTIONS } from "./ai-builder.prompt";
import { assertNumericalClaimsSupported } from "../../shared/ai/numeric-evidence";
import { auditResumeWriting } from "../../shared/ai/writing-quality";



/**
 * Preserve identity, employers, dates, education and skills exactly as
 * supplied. AI may propose phrasing, but cannot control those factual fields.
 * The response uses the existing React/Zustand editor contract.
 */
export async function buildResumeFromQuestionnaire(input: Questionnaire) {
  const proposed = await generateJson(BUILDER_INSTRUCTIONS, input, resumeDraftSchema);

  // Check user-originated source numbers before any AI text reaches the editor.
  assertNumericalClaimsSupported(JSON.stringify(input), [proposed.summary, ...proposed.experienceBullets.flatMap(item=>item.bullets), ...proposed.projectBullets.flatMap(item=>item.bullets)]);

  const experienceBullets = new Map<number, string[]>();
  for (const item of proposed.experienceBullets) {
    if (item.index < input.experience.length && !experienceBullets.has(item.index)) {
      experienceBullets.set(item.index, item.bullets);
    }
  }
  const projectBullets = new Map<number, string[]>();
  for (const item of proposed.projectBullets) {
    if (item.index < input.projects.length && !projectBullets.has(item.index)) {
      projectBullets.set(item.index, item.bullets);
    }
  }
  const [city = "", ...rest] = input.location.split(",").map(part => part.trim());

  return {
    inputValue: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      city,
      country: rest.join(", "),
      label: input.targetRole,
      summary: proposed.summary,
      additionalInfo: input.additionalInfo,
    },
    fields: {
      experience: input.experience.map(job => ({
        companyName: job.company,
        jobPosition: job.position,
        jobStartDate: job.startDate,
        jobEndDate: job.endDate,
        jobSummary: job.responsibilities,
      })),
      education: input.education.map(edu => ({
        institution: edu.institution,
        studyType: edu.degree,
        area: "",
        startDate: "",
        endDate: edu.dates,
      })),
      skills: input.skills.length ? [{ skillName: "Relevant Skills" }] : [],
      projects: input.projects.map(item => ({ name: item.name, description: item.description })),
      certificates: [],
      awards: [],
    },
    tagFields: {
      ...Object.fromEntries(
        input.experience.map((_, index) => [
          `jobHighlights-${index}`,
          { tags: experienceBullets.get(index) ?? [], input: "", suggestions: [] },
        ]),
      ),
      ...Object.fromEntries(input.projects.map((_, index) => [
        `projectHighlights-${index}`,
        { tags: projectBullets.get(index) ?? [], input: "", suggestions: [] },
      ])),
      ...(input.skills.length ? { "skills-0": { tags: input.skills, input: "", suggestions: [] } } : {}),
    },
    clarificationQuestions: proposed.clarificationQuestions,
    writingNotes: [...new Set([...proposed.writingNotes, ...auditResumeWriting([proposed.summary, ...proposed.experienceBullets.flatMap(item => item.bullets), ...proposed.projectBullets.flatMap(item => item.bullets)])])],
    requiresReview: true,
    reviewMessage: "AI-drafted wording must be checked for accuracy before export.",
  };
}
