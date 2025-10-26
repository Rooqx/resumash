import express from "express";
import fs from "fs";
import path from "path";

const logRouter = express.Router();

// 🧠 Helper to read and filter logs
const getLogs = (filters: { level?: string; date?: string } = {}) => {
  const filePath = path.join(process.cwd(), "logs", "combined.log");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  // Read the log file
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split("\n").filter(Boolean);

  // Convert each JSON log line into an object
  const logs = lines
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // Filter by level and date (optional)
  return logs.filter((log) => {
    const matchesLevel = filters.level ? log.level === filters.level : true;
    const matchesDate = filters.date
      ? log.timestamp.startsWith(filters.date)
      : true;
    return matchesLevel && matchesDate;
  });
};

// 🚀 GET /logs?level=error&date=2025-10-26
logRouter.get("/", (req, res) => {
  try {
    const { level, date } = req.query;
    const logs = getLogs({
      level: level as string,
      date: date as string,
    });

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to read logs",
      error: (err as Error).message,
    });
  }
});

export default logRouter;
