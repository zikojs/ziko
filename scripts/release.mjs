#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createTemplateSync } from "@zikojs/workflow";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SCAFFOLDERS = [
  "create-ziko/templates/*",
];

export async function release({
  name,
  remote = "origin",
  prefix = `${name}-v`,
  commitMessage = (version) => `chore: release ${version}`,
} = {}) {
  if (!name) {
    throw new Error("Release name is required.");
  }

  const sync = createTemplateSync(root, SCAFFOLDERS);
  const rl = createInterface({ input: stdin, output: stdout });

  function git(...args) {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["inherit", "pipe", "inherit"],
    }).trim();
  }

  let prepared = false;

  try {
    const version = (
      await rl.question("Enter release version (e.g. 1.0.0): ")
    ).trim();

    if (!/^[0-9]+(\.[0-9]+)*(-[a-zA-Z0-9.-]+)?$/.test(version)) {
      throw new Error(`Invalid version: ${version}`);
    }

    const tag = `${prefix}${version}`;

    if (git("status", "--porcelain")) {
      git("add", ".");
      if (git("diff", "--cached", "--name-only")) {
        git("commit", "-m", commitMessage(version));
      }
    } else {
      console.log("No changes to commit.");
    }

    sync.prepare();
    prepared = true;

    git("add", ".");

    if (git("diff", "--cached", "--name-only")) {
      git("commit", "-m", `chore: prepare templates for ${version}`);
    }

    git("tag", tag);
    git("push", remote, "HEAD");
    git("push", remote, tag);

    console.log(`Released tag: ${tag}`);

    return tag;
  } finally {
    try {
      if (prepared) {
        sync.restore();
      }
    } finally {
      rl.close();
    }
  }
}

release({ name: "ziko" });