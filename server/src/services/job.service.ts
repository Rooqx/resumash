import { PDFParse } from "pdf-parse";
import { LLM_API_KEY, LLM_URL, MODEL } from "../configs/env.configs";
import { OpenAI } from "openai";
import { AppError } from "../middlewares/error.middleware";
import extractJSON from "../utils/extractJson";
import { logger } from "../utils/logger";
import resumeRewritePrompt from "../utils/prompts/resume-tailor";

class Job {
  jobDescription: string;
  resume: Buffer;
  constructor(jobDescription: string, resume: Buffer) {
    this.jobDescription = jobDescription;
    this.resume = resume;
  }
  public async updatesBlocks() {
    //Call resume block and save it
    const resumeBlocks = await this.extractResumeBlocks();

    logger.info("Querying OpenAI for tailored resume");
    //create openai client
    const client = new OpenAI({
      // Legacy service is retained for compatibility; use the same provider.
      baseURL: LLM_URL?.replace(/\/chat\/completions\/?$/, ""),
      apiKey: LLM_API_KEY,
    });

    if (!client) {
      throw new AppError("OpenAI client not initialized", 500);
    }

    const chatCompletion = await client.chat.completions.create({
      model: MODEL as string,
      messages: [
        {
          role: "system",
          content: resumeRewritePrompt,
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

    if (!chatCompletion) {
      throw new AppError("Failed to get chat completion", 500);
    }

    logger.info("Query successful resume Tailored");
    logger.info(`Total Token Used: ${chatCompletion.usage?.total_tokens}`);
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
    const dataBuffer = this.resume;

    try {
      const data = new PDFParse({ data: dataBuffer }); //Main extraction
      const textResult: any = await data.getText(); //Get the text
      if (!textResult) {
        throw new AppError("Failed to extract text from PDF", 500);
      }
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

      // Check if resume contains at least one known section header
      const hasSectionHeader = lines.some((line: any) => {
        const normalized = line.toLowerCase();
        return SECTION_HEADERS.some((header) => normalized.startsWith(header));
      });

      if (!hasSectionHeader) {
        throw new AppError(
          "this resume is invalid — no valid section headers found",
          400
        );
      }

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
      logger.info("✅ Saved structured blocks to resume_blocks.json");
      const JSONBlock = JSON.stringify(blocks); //turn blocks into json
      // console.log("JSONBlock", JSONBlock);
      return JSONBlock;
    } catch (error) {
      logger.error("❌ Error reading PDF:", error);
      throw error;
    }
  }

  public async returnTailorResume() {
    //Get message content from updatesBlocks
    const rawMessage = (await this.updatesBlocks()) || "";
    // console.log("rawMessage", rawMessage);
    //Sanitize message so it would return a perfect json
    const tailoredResume = extractJSON(rawMessage);
    //validate tailoredResume
    if (!tailoredResume) throw new AppError("Failed to extract JSON", 400);
    logger.info("✅ Tailored resume extracted");
    return tailoredResume;
  }
}

export default Job;
