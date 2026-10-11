import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { ENV, HF_TOKEN, MODEL, PORT } from "./configs/env.configs";
import logRouter from "./routers/logs.route";
import { connectToRedis } from "./db/redis";
import { connectToMongo } from "./db/mongo";
import resumeRouter from "./routers/resume.router";
const app = express();

// Trust proxy configuration must match deployment infrastructure. Default: do not trust forwarded IP headers.
if (process.env.TRUST_PROXY_HOPS) {
  const hops = Number(process.env.TRUST_PROXY_HOPS);
  if (!Number.isInteger(hops) || hops < 0 || hops > 5) throw new Error("Invalid TRUST_PROXY_HOPS");
  app.set("trust proxy", hops);
}
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(cors());
// Resume documents are private and must never be served as static files.

app.get("/", (_req, res) => {
  res.send("Hello from Server (Express + TS) 👋");
});

app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/logs", logRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("MODEL", MODEL);
  //await connectToMongo();
  //await connectToRedis();

  console.log(`Environment:${ENV}`);
});
