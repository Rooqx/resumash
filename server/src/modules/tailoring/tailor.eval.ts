/**
 * Opt-in live Tailor evaluation with synthetic text-based PDFs.
 * Invoked with LLM_API_KEY and MODEL configured. Does not run in CI.
 *
 * Tests cannot replace a human recruiter review. They confirm that
 * model responses pass structural, numerical and baseline provenance gates.
 */
import { PDFDocument, StandardFonts } from "pdf-lib";
import { tailorResume } from "./tailor.service";

const cases = [
  {
    role: "retail customer service",
    resume: [
      "Taylor Example",
      "Customer Service Assistant at Fictional Market, 2023 - 2025",
      "Handled customer inquiries and maintained daily inventory records.",
    ],
    job: "Retail associate required to assist customers, manage stock, and resolve questions in a busy store.",
  },
  {
    role: "engineering, missing Kubernetes experience",
    resume: [
      "Morgan Example",
      "Backend Developer at Fictional Systems, 2022 - 2025",
      "Built Node.js APIs and deployed services using Docker.",
    ],
    job: "Backend engineer needed to build APIs and operate Kubernetes clusters. Docker experience preferred.",
  },
];

/** Create a minimal selectable-text PDF without real candidate information. */
async function createPdf(lines: string[]): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  lines.forEach((line, index) => page.drawText(line, {
    x: 54, y: 785 - index * 28, size: 11, font,
  }));
  return Buffer.from(await doc.save());
}

if (!process.env.LLM_API_KEY || !process.env.MODEL) {
  throw new Error("Set LLM_API_KEY and MODEL before running live Tailor evaluation");
}

let failures = 0;
for (const item of cases) {
  try {
    const result = await tailorResume(await createPdf(item.resume), item.job);
    if (!result.requiresReview) throw new Error("Review requirement missing");
    if (item.role.includes("Kubernetes") && result.fields.skills?.some((skill: Record<string, unknown>) =>
      String(skill.skillName ?? "").toLowerCase().includes("kubernetes")
    )) {
      throw new Error("Unsupported Kubernetes skill was inserted");
    }
    console.info(`PASS: ${item.role}; ${result.suggestions.length} source-anchored edit(s)`);
  } catch (error) {
    failures++;
    console.error(`FAIL: ${item.role}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
if (failures) process.exitCode = 1;
