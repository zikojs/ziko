import path from "node:path";
import { spawn } from "node:child_process";

import {
  createTemplateSync,
} from "pnpm-temaplets-sync";

const root = path.resolve(
  import.meta.dirname,
  ".."
);

const SCAFFOLDERS = [
  "create-ziko/templates/*",
  // "create-ufbr/templates/*",
];

const sync = createTemplateSync(
  root,
  SCAFFOLDERS
);

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("Usage: node scripts/sync.js <command> [...args]");
  process.exit(1);
}

sync.prepare();

const child = spawn(command, args, {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

child.on("close", (code) => {
  try {
    sync.restore();
  } finally {
    process.exit(code ?? 1);
  }
});

child.on("error", (error) => {
  console.error(error);

  try {
    sync.restore();
  } 
  finally {
    process.exit(1);
  }
});