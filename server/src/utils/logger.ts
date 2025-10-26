import { createLogger, format, transports } from "winston";
import fs from "fs";

const { combine, timestamp, errors, json, printf } = format;

// Ensure logs folder exists
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

// 💾 JSON format for queryable logs
const jsonFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json() // each log line is valid JSON
);

// 🧱 Create Winston logger instance
export const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: jsonFormat,
  transports: [
    // Log to console too (for debugging)
    new transports.Console({
      format: combine(
        format.colorize(),
        printf(
          ({ level, message, timestamp }) =>
            `[${timestamp}] [${level}] ${message}`
        )
      ),
    }),

    // Log everything (info, warn, error)
    new transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),

    // Log only errors
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});
