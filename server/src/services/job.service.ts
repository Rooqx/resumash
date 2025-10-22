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
import extractJSON from "../utils/extractJson";
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
    // accounts/fireworks/models/qwen2p5-vl-32b-instruct
    const chatCompletion = await client.chat.completions.create({
      model: "accounts/fireworks/models/qwen2p5-vl-32b-instruct",
      messages: [
        {
          role: "system",
          content: `
You are an elite technical resume writer and senior software engineer. Your task is to read a provided job description (any field or level) and the candidate’s structured resume data (inputBlocks), then produce a perfectly tailored professional resume JSON aligned with that specific job. 

The goal is to rewrite and reshape the resume so that it reads as if the candidate is the *ideal fit* for the job—highlighting the skills, experience, and achievements that best match the job description.

--------------------
🎯 OBJECTIVE:
Produce a job-specific resume that:
- Prioritizes the technologies, methods, and soft skills emphasized in the job description.
- Rewrites or reorders sections to reflect the most relevant experience.
- Minimizes or omits unrelated content (e.g., backend details for a frontend job).
- Uses professional, senior-level phrasing and measurable impact statements.

--------------------
🧠 INPUT:
You will receive:
1) \`inputBlocks\`: an array of resume sections with shape:
   { "block": string, "content": string, "subBlocks": any[] }

2) \`job_description\`: a text string containing the job posting or details.

--------------------
🧩 OUTPUT FORMAT:
Return **only one valid JSON object** that follows this schema exactly:

{
  "inputValue": {
    "fullName": "...",
    "label": "...",
    "email": "...",
    "phone": "...",
    "linkdlnUrl": "...",
    "githubUrl": "...",
    "city": "...",
    "country": "...",
    "portfolioUrl": "...",
    "summary": "..."
  },
  "fields": {
    "skills": [ { "skillName": "..." }, ... ],
    "experience": [ { "companyName":"...", "jobPosition":"...", "jobStartDate":"Month YYYY", "jobEndDate":"Month YYYY or Present", "jobSummary":"..." }, ... ],
    "education": [ { "institution":"...", "studyType":"...", "area":"...", "startDate":"Month YYYY or YYYY", "endDate":"Month YYYY or YYYY or Present" } ],
    "projects": [ { "name":"...", "description":"...", "url":"..." } ],
    "certificates": [ { "certificateDate":"Month YYYY", "certificateIssuer":"...", "certificateName":"...", "certificateUrl":"..." } ],
    "awards": [ { "awardDate":"Month YYYY", "awardSummary":"...", "awardTitle":"...", "awarder":"..." } ]
  },
  "tagFields": {
    "skills-0": { "tags": ["..."] },
    "skills-1": { "tags": ["..."] },
    "skills-2": { "tags": ["..."] },
    "jobHighlights-0": { "tags": ["..."] },
    "projectTechnologies-0": { "tags": ["..."] }
  }
}

--------------------
⚙️ TAILORING RULES:
1. **Dynamic Alignment**
   - Extract keywords, skills, tools, and frameworks from the job_description.
   - Rewrite the candidate’s summary, skills, and experience to strongly reflect those terms.
   - Adapt transferable experience (e.g., if the job requires Vue.js and the candidate has React, write “Built reusable UI components in React, transferable to Vue.js”).

2. **Summary**
   - Always generate a professional, concise summary aligned with the job description.
   - Use 2–4 sentences written in a confident, senior-level tone.
   - Clearly highlight the candidate’s main strengths, relevant experience, and technical expertise.
   - Ensure the language matches the target role’s seniority and tech stack.
   - Example:
     “Results-driven Frontend Developer with 5+ years of experience building responsive and scalable web interfaces using React and TypeScript. Adept at collaborating in agile teams and optimizing UI performance for better user engagement.”


3. **Skills**
   - Include **a maximum of 5 total skillName entries**.
   - Prioritize skills that are **most relevant to the job description**.
   - Each skillName must represent a **broad professional area**, not a specific tool.
     Examples:
       - Frontend Development
       - Backend Development
       - Cybersecurity
       - Cloud Engineering
       - UI/UX Design
       - Data Analysis
   - Place specific technologies and frameworks as **tags** under the corresponding skill key in \`tagFields\`.

4. **Experience**
   - Include only the 2–3 most relevant roles.
   - Set each \`jobSummary\` to an empty string ("").
   - Instead, extract the main achievements or contributions from the summary and include them as bullet points inside the corresponding \`jobHighlights-{index}\` tags.
   - Each jobHighlights array should include **3–4 short, action-based bullet points**.

5. **Label (Job Title)**
   - The "label" must match only the core job title from the job description.
   - Remove extra details like level, location, or text in parentheses.
     Examples:
       - “Job Title: Frontend Developer (AngularJS)” → "Frontend Developer"
       - “Senior Backend Developer – Remote” → "Backend Developer"

6. **Respect Input Structure**
   - Do not add new sections (e.g., projects, certificates, awards) that were not in the inputBlocks.
   - Output structure must mirror the input exactly — modify existing blocks only.
   - If a block is missing in the input, omit it from the output JSON.

7. **tagFields (Strict Mapping)**
   - Each skill → skills-0, skills-1, etc.
   - Each experience → jobHighlights-0, jobHighlights-1, etc.
   - Each project (if exists) → projectTechnologies-0, projectTechnologies-1, etc.
   - Each tag array should include 3–6 concise items.
   - Maintain proper numeric indexing that matches the corresponding array.

8. **Language & Tone**
   - Confident, senior-level, and metric-driven.
   - Avoid filler or redundancy.
   - Emphasize measurable achievements, performance, and technical depth.

--------------------
📦 OUTPUT RULES:
- Output **only** valid JSON — no markdown, no extra text.
- Always include every key in the schema (even if empty).
- Ensure all tagFields keys match actual item indexes (skills-0, jobHighlights-1, etc.).
- Be truthful — do not fabricate jobs or qualifications.

--------------------
TASK:
Analyze the job_description and inputBlocks. Then output a clean, well-structured JSON resume perfectly tailored to that job posting — ready for recruiters to read as if the candidate was made for that role.

`,
        },
        {
          role: "user",
          content: `{
  "inputBlocks": ${resumeBlocks},
  "job_description": ${this.jobDescription}
}`,
        },
      ],
    });

    console.log("chatCompletion:", chatCompletion);
    console.log("Tailored Resume:", chatCompletion?.choices[0]?.message);

    return chatCompletion?.choices[0]?.message.content;
  }

  //Function to extract resume blocks and return { block: string; content: string; subBlocks: any[] }[]
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
      const data = new PDFParse({ data: dataBuffer }); //Main extraction
      const textResult: any = await data.getText(); //Get the text
      await data.destroy(); //Clean up function to avoid memory leaks

      // Clean up text and remove extra spaces
      const text =
        textResult && textResult.text ? textResult.text.replace(/\r/g, "") : "";
      const lines = text
        .split("\n")
        .map((l: any) => l.trim())
        .filter((l: any) => l);
      const blocks: { block: string; content: string; subBlocks: any[] }[] = [];

      //This is to arrange the extracted text into blocks so we get block name, content and subblocks.
      let currentBlock = "";
      let currentContent: string[] = [];
      let currentSubBlocks: any[] = [];
      let headerCollected = false;

      //This is to check if the line starts with a section header
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
            matchedSection[0]?.toUpperCase() + matchedSection.slice(1);
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
      const JSONBlock = JSON.stringify(blocks); //turn blocks into json
      // console.log("JSONBlock", JSONBlock);
      return JSONBlock;
    } catch (error) {
      console.error("❌ Error reading PDF:", error);
    }
  }

  public async returnTailorResume() {
    //Get message content from updatesBlocks
    const rawMessage = (await this.updatesBlocks()) || "";
    console.log("rawMessage", rawMessage);
    //Sanitize message so it would return a perfect json
    const tailoredResume = extractJSON(rawMessage);
    //validate tailoredResume
    if (!tailoredResume) throw new AppError("Failed to extract JSON", 400);
    console.log("tailoredResume", tailoredResume);
    return tailoredResume;
  }
}

export default Job;
