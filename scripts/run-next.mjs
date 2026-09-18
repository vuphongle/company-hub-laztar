import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

const command = process.argv[2];

if (command !== "dev" && command !== "start") {
  console.error("Usage: node scripts/run-next.mjs <dev|start>");
  process.exit(1);
}

loadEnvConfig(process.cwd(), command === "dev");

const port = process.env.PORT;
if (!port || !/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  console.error("PORT must be an integer between 1 and 65535. Copy .env.example to .env.local first.");
  process.exit(1);
}

const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);
const child = spawn(process.execPath, [nextBin, command, ...process.argv.slice(3)], {
  env: process.env,
  stdio: "inherit",
});

child.once("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
