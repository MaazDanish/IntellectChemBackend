import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Simulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensures that a directory exists for the current date.
 * If it doesn't exist, it creates the directory.
 */
export function getLogDirectory(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const logDir = path.join(__dirname, "..", "..", "logs", `${day}-${month}-${year}`);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return logDir;
}
