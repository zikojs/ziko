#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = createInterface({ input: stdin, output: stdout });

function git(...args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "inherit"],
  }).trim();
}

try {
  const VERSION = await rl.question(
    "Enter release version (e.g. 1.0.0 or 1.0.0.1): "
  );

  if (!/^[0-9]+(\.[0-9]+)*(-[a-zA-Z0-9.-]+)?$/.test(VERSION)) {
    console.error(`Invalid version: ${VERSION}`);
    process.exitCode = 1;
  } else {
    const TAG = `notebook-v${VERSION}`;

    // Ensure there are changes to commit
    if (!git("status", "--porcelain")) {
      console.log("No changes to commit.");
    } else {
      git("add", ".");
      git("commit", "-m", `chore: release ${VERSION}`);
    }

    // Create and push the release tag
    git("tag", TAG);
    git("push", "origin", "HEAD");
    git("push", "origin", TAG);

    console.log(`Released tag: ${TAG}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  rl.close();
}
