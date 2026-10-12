import { createLogger, format, transports } from "winston";

/**
 * Structured, production-friendly JSON logs on stdout/stderr.
 * The hosting platform is responsible for retention. Never log request
 * bodies, resume text, authorization headers, cookies or provider payloads.
 */
export const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: process.env.NODE_ENV !== "production" }),
    format.json(),
  ),
  transports: [new transports.Console()],
});
