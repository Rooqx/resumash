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

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/uploads", express.static("uploads"));

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
