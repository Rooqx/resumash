import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { ENV, HF_TOKEN, PORT } from "./configs/env.configs";
import { connectToRedis } from "./db/redis";
import { connectToMongo } from "./db/mongo";
import Job from "./services/job.service";
import { extractLayout } from "./controllers/prac";
import resumeRouter from "./routers/resume.router";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => {
  res.send("Hello from Server (Express + TS) 👋");
});

const folder = fs.existsSync("uploads/176105325841-Resume.pdf");
console.log("folder:", folder);

/*const job = new Job(
  `Job title : Front End Developer
Job Location : Lagos Deadline : October 10, 2025 Quick Recommended Links

Job Description

We are looking for ahighly skilled Frontend Engineer with2-4 years of experience to join our team.
The ideal candidate should have experience working with large codebases, be able to work independently with clear or ambiguous designs, and demonstrate strong problem-solving skills.
Key Requirements

Proficiency inTypeScript, React, Next.js
Strong understanding ofHTML, CSS, JavaScript
Experience withSockets and GraphQL
Solid grasp ofData Structures & Algorithms
Ability to write and execute tests forfrontend applications
Good leadership skills and the ability to work well under pressure
Strong adherence to deadlines and aself-motivated, can-do attitude
Experience working withservice workers
Bonus: Experience with Angular.`,
  "test2.pdf"
);
console.log("HF_TOKEN", HF_TOKEN);
job.extractResumeBlocks();*/
/*job
  .test({
    messages: [
      {
        role: "user",
        content: "What is the capital of France?",
      },
    ],
    model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
  })
  .then((response) => {
    console.log(JSON.stringify(response));
  });*/

app.use("/api/v1/resumes", resumeRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  await connectToMongo();
  await connectToRedis();
  console.log(`Environment:${ENV}`);
});
