import * as fs from "fs";
import * as path from "path";

/**
 * Ensures that a directory exists for the current date.
 * If it doesn't exist, it creates the directory.
 */
export function getLogDirectory(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const logDir = path.join(__dirname, "..", "..", "logs", day + "-" + month + "-" + year.toString());

  // Create the directory structure if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return logDir;
}
