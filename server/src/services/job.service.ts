import fs from "fs";
import { PDFParse } from "pdf-parse";
import { HF_TOKEN } from "../configs/env.configs";
import { OpenAI } from "openai";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import multer from "multer";
import { AppError } from "../middlewares/error.middleware";
export interface ResumeBlock {
  block: string;
  content: string;
  startLine: number;
  endLine: number;
}

export interface ResumeLayout {
  fileName: string;
  blocks: ResumeBlock[];
}
class Job {
  jobDescription: string;
  resume: any;
  constructor(jobDescription: string, resume: any) {
    this.jobDescription = jobDescription;
    this.resume = resume;
  }
  public async updatesBlocks() {
    //Get job description
    const jobDesc = this.jobDescription;
    // console.log("jobDesc:", jobDesc);

    //Call resume block and save it
    const resumeBlocks = await this.extractResumeBlocks();
    //   console.log("resumeBlocks:", resumeBlocks);

    //create openai client
    const client = new OpenAI({
      baseURL: "https://api.fireworks.ai/inference/v1",
      apiKey: "fw_3ZZScoGVZuD8RgwN8mgUrn3p", //Save to .env
    });

    const chatCompletion = await client.chat.completions.create({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      messages: [
        {
          role: "system", //Default prompt that tells the ai what to always do
          content: `
You are "ResumeRefine", a professional resume optimization AI.
Your purpose is to enhance resumes so they align with a given job description,
while keeping tone, structure, and word count nearly identical to the original.
You output clean, valid JSON only.
      `,
        },
        {
          role: "user", //User prompt pass the contents to the ai
          content: `
You will receive:

1. A **Job Description**  
2. Multiple **resume blocks** in the following array format:
\`\`\`json
[
  { "block": "string", "content": "string" },
  ...
]
\`\`\`

### Your tasks:
- Rewrite **each block's content** so it aligns with the Job Description.
- Maintain the **same structure**, **tone**, and **format**.
- Do **not** exceed or reduce length by more than **±5%**.
- If a block isn’t related (e.g., Education, Projects), **just polish** the language.
- Keep **all block keys**, **order**, and **details** unchanged.
- Return **ONLY** the final JSON array — no explanations, no code fences, no extra text.

⚠️ Rules:
- Output must be a **pure JSON array** (no markdown, no comments).
- Do not merge, rename, or omit any blocks.

---

**Job Description:**
${jobDesc}

**Resume Blocks:**
${JSON.stringify(resumeBlocks, null, 2)}
`,
        },
      ],
    });
    console.log("chatCompletion:", chatCompletion);
    console.log(chatCompletion?.choices[0]?.message);
    return chatCompletion?.choices[0]?.message;
  }
  public async extractResumeBlocks() {
    // Define known resume section titles (add more as needed)
    const SECTION_HEADERS = [
      "summary",
      "experience",
      "work experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "contact",
      "interests",
      "profile",
      "achievements",
    ];
    if (!this.resume) {
      throw new AppError("file missing", 400);
    }
    const dataBuffer = fs.readFileSync(this.resume as string);

    try {
      //const data = new PDFParse(dataBuffer);
      const data = new PDFParse({ data: dataBuffer });
      const textResult: any = await data.getText();
      await data.destroy();

      // Clean up text
      const text =
        textResult && textResult.text ? textResult.text.replace(/\r/g, "") : "";
      const lines = text
        .split("\n")
        .map((l: any) => l.trim())
        .filter((l: any) => l);
      const blocks: { block: string; content: string; subBlocks: any[] }[] = [];

      let currentBlock = "";
      let currentContent: string[] = [];
      let currentSubBlocks: any[] = [];
      let headerCollected = false;

      for (const line of lines) {
        const normalized = line.toLowerCase();
        const matchedSection = SECTION_HEADERS.find((header) =>
          normalized.startsWith(header)
        );

        // 🔹 Handle section headers
        if (matchedSection) {
          // If this is the first section and we haven't saved a header yet:
          if (!headerCollected && currentContent.length > 0) {
            blocks.push({
              block: "Header",
              content: currentContent.join(" "),
              subBlocks: [],
            });
            headerCollected = true;
          }

          // Save the previous block
          if (
            currentBlock &&
            (currentContent.length > 0 || currentSubBlocks.length > 0)
          ) {
            blocks.push({
              block: currentBlock,
              content: currentContent.join(" "),
              subBlocks: currentSubBlocks,
            });
          }

          // Reset for the new section
          currentBlock =
            matchedSection[0].toUpperCase() + matchedSection.slice(1);
          currentContent = [];
          currentSubBlocks = [];
        } else {
          // 🔹 Detect sub-blocks (Experience / Projects)
          if (
            currentBlock.toLowerCase().includes("experience") ||
            currentBlock.toLowerCase().includes("project") ||
            currentBlock.toLowerCase().includes("education")
          ) {
            if (/^[A-Z].*(—|-).*$/g.test(line)) {
              currentSubBlocks.push({ title: line, details: [] });
            } else if (currentSubBlocks.length > 0) {
              currentSubBlocks[currentSubBlocks.length - 1].details.push(line);
            } else {
              currentContent.push(line);
            }
          } else {
            currentContent.push(line);
          }
        }
      }

      // 🔹 Handle the last collected section
      if (!headerCollected) {
        // No section headers at all → everything is the header
        blocks.push({
          block: "Header",
          content: currentContent.join(" "),
          subBlocks: [],
        });
      } else if (currentBlock) {
        blocks.push({
          block: currentBlock,
          content: currentContent.join(" "),
          subBlocks: currentSubBlocks,
        });
      }
      // Save to file or return
      fs.writeFileSync("resume_blocks.json", JSON.stringify(blocks, null, 2));
      console.log("✅ Saved structured blocks to resume_blocks.json");
      console.log(blocks);
      return blocks;
    } catch (error) {
      console.error("❌ Error reading PDF:", error);
    }
  }
  public async getResumeLayout() {
    const pdfPath = this.resume;
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    const layout: any[] = [];
    const pageHeights: Record<number, number> = {};

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      pageHeights[i] = viewport.height;

      const textContent = await page.getTextContent();

      for (const item of textContent.items) {
        if ("transform" in item) {
          const [a, b, c, d, e, f] = item.transform;
          const fontSize = Math.sqrt(a * a + b * b);

          layout.push({
            text: item.str,
            x: e,
            y: f,
            fontSize,
            page: i,
          });
        }
      }
    }

    console.log("✅ Layout extracted");
    const replacements: any = await this.extractResumeBlocks();
    await this.rebuildPDFWithLayout(
      layout,
      replacements,
      pageHeights,
      "resume_updated.pdf"
    );
  }

  public async returnUpdatedResume() {
    //  const updatedResume = await this.updateResume();
  }
  public async test(data: any) {
    console.log("test running");

    const client = new OpenAI({
      baseURL: "https://api.fireworks.ai/inference/v1",
      apiKey: "fw_3ZZScoGVZuD8RgwN8mgUrn3p", // ⚠️ Don't expose this publicly
    });
    const chatCompletion = await client.chat.completions.create({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      messages: [
        {
          role: "user",
          content: "What is the capital of France?",
        },
      ],
    });

    console.log(chatCompletion.choices[0].message.content);
    /*const response = await fetch(
      "",
      {
        headers: {
          Authorization: `Bearer fw_3ZZScoGVZuD8RgwN8mgUrn3p`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    console.log("Result:", result);
    return result;*/
  }
}

export default Job;
