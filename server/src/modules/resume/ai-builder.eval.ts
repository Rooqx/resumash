/**
 * Opt-in LIVE model evaluation of AI resume-building quality.
 *
 * Run only in a configured development environment:
 *   bun run eval:ai
 *
 * Uses fictional candidate facts. Never log production resume documents,
 * API credentials, or personally identifying user data.
 * This is a small smoke evaluation, not a statistically representative study.
 */
import { questionnaireSchema } from "./ai-builder.schema";
import { buildResumeFromQuestionnaire } from "./ai-builder.service";
import { auditResumeWriting } from "../../shared/ai/writing-quality";

const cases = [
  {
    label: "entry-level retail",
    input: {
      fullName: "Taylor Example",
      targetRole: "Retail Assistant",
      careerLevel: "entry",
      skills: ["Customer service", "Inventory records"],
      experience: [{ company: "Fictional Market", position: "Sales Assistant", startDate: "2024", endDate: "2025", responsibilities: "Helped customers choose products and updated the store's stock records." }],
    },
  },
  {
    label: "student project",
    input: {
      fullName: "Morgan Example",
      targetRole: "Junior Developer",
      careerLevel: "student",
      skills: ["React"],
      projects: [{ name: "Budget Tracker", description: "Built a React app that records household expenses by category." }],
    },
  },
  {
    label: "operations professional",
    input: {
      fullName: "Avery Example",
      targetRole: "Operations Coordinator",
      careerLevel: "mid",
      skills: ["Dispatch scheduling", "Excel"],
      experience: [{ company: "Fictional Logistics", position: "Coordinator", startDate: "2021", endDate: "2025", responsibilities: "Coordinated driver schedules, organized delivery records, and resolved dispatch delays." }],
    },
  },
  {
    label: "senior engineering manager",
    input: {
      fullName: "Jordan Example",
      targetRole: "Engineering Manager",
      careerLevel: "senior",
      skills: ["Technical planning", "Backend systems"],
      experience: [{ company: "Fictional Systems", position: "Team Lead", startDate: "2020", endDate: "2025", responsibilities: "Led a team of four developers delivering internal APIs and reviewed technical design proposals." }],
    },
  },
] as const;

async function main(): Promise<void> {
  if (!process.env.LLM_API_KEY || !process.env.MODEL) {
    throw new Error("Set LLM_API_KEY and MODEL to run live model evaluation.");
  }

  let passed = 0;
  for (const sample of cases) {
    const input = questionnaireSchema.parse(sample.input);
    try {
      const draft = await buildResumeFromQuestionnaire(input);
      if (draft.inputValue.fullName !== input.fullName ||
          draft.inputValue.label !== input.targetRole) {
        throw new Error("Model output changed protected candidate identity.");
      }
      const prose = [
        draft.inputValue.summary,
        ...Object.values(draft.tagFields).flatMap(field => field.tags),
      ];
      const warnings = auditResumeWriting(prose);
      const status = warnings.length ? "REVIEW" : "PASS";
      console.info(`${status}: ${sample.label} (${warnings.length} writing warnings)`);
      if (!warnings.length) passed++;
    } catch (error) {
      console.error(`FAIL: ${sample.label}: ${error instanceof Error ? error.message : "Unexpected generation failure"}`);
      process.exitCode = 1;
    }
  }
  console.info(`Smoke eval: ${passed}/${cases.length} scenarios had zero heuristic writing warnings. Human review is still required.`);
}

await main();
