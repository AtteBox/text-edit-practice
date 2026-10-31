import { execFileSync } from "node:child_process";

// Start every run with an empty highscore table in DynamoDB Local
export default function globalSetup() {
  execFileSync(
    process.execPath,
    ["scripts/create-local-table.mjs", "--recreate", "test"],
    { stdio: "inherit", env: { ...process.env, NODE_ENV: "test" } },
  );
}
