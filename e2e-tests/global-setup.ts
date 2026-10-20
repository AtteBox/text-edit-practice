import { execFileSync } from "node:child_process";

// Create the highscore table in DynamoDB Local before the tests run
export default function globalSetup() {
  execFileSync(
    process.execPath,
    ["scripts/create-local-table.mjs", "test", "http://localhost:8000"],
    { stdio: "inherit" },
  );
}
