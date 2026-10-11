import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { ENV, HF_TOKEN, MODEL, PORT } from "./configs/env.configs";
import logRouter from "./routers/logs.route";
import resumeRouter from "./routers/resume.router";
import coverLetterRouter from "./routers/cover-letter.router";
const app = express();

// Trust proxy configuration must match deployment infrastructure. Default: do not trust forwarded IP headers.
if (process.env.TRUST_PROXY_HOPS) {
  const hops = Number(process.env.TRUST_PROXY_HOPS);
  if (!Number.isInteger(hops) || hops < 0 || hops > 5) throw new Error("Invalid TRUST_PROXY_HOPS");
  app.set("trust proxy", hops);
}
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
// Only approved web frontends can read browser API responses.
// CORS is not authentication; Redis still applies to direct HTTP clients.
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_DEVELOPMENT_URL,
    process.env.FRONTEND_PRODUCTION_URL,
  ].filter((origin): origin is string => Boolean(origin)),
);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin not allowed"));
  },
}));
// Resume documents are private and must never be served as static files.

app.get("/", (_req, res) => {
  res.send("Hello from Server (Express + TS) 👋");
});

app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/cover-letters", coverLetterRouter);
app.use("/api/v1/logs", logRouter);

/** Translate Multer resource-limit errors into client-actionable statuses. */
const uploadErrorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (error instanceof multer.MulterError) {
    response.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
      message: error.code === "LIMIT_FILE_SIZE"
        ? "Resume file is too large (maximum 10 MB)."
        : "Invalid resume upload.",
    });
    return;
  }
  next(error);
};
app.use(uploadErrorHandler);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("MODEL", MODEL);
  //await connectToMongo();
  //await connectToRedis();

  console.log(`Environment:${ENV}`);
});
