import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { ENV, PORT } from "./configs/env.configs";
import { connectToRedis } from "../db/redis";
import { connectToMongo } from "../db/mongo";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(errorHandler);

app.get("/", (_req, res) => {
  res.send("Hello from Server (Express + TS) 👋");
});

app.listen(PORT, async () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  await connectToMongo();
  await connectToRedis();
  console.log(`Environment:${ENV}`);
});
