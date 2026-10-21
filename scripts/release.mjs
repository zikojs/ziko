import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

export async function release({
  name,
  remote = "origin",
  prefix = `${name}-v`,
  commitMessage = (version) => `chore: release ${version}`,
} = {}) {
  if (!name) {
    throw new Error("Release name is required.");
  }

  const rl = createInterface({ input: stdin, output: stdout });

  function git(...args) {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["inherit", "pipe", "inherit"],
    }).trim();
  }

  try {
    const version = await rl.question(
      "Enter release version (e.g. 1.0.0 or 1.0.0.1): "
    );

    if (!/^[0-9]+(\.[0-9]+)*(-[a-zA-Z0-9.-]+)?$/.test(version)) {
      throw new Error(`Invalid version: ${version}`);
    }

    const tag = `${prefix}${version}`;

    if (!git("status", "--porcelain")) {
      console.log("No changes to commit.");
    } else {
      git("add", ".");
      git("commit", "-m", commitMessage(version));
    }

    git("tag", tag);
    git("push", remote, "HEAD");
    git("push", remote, tag);

    console.log(`Released tag: ${tag}`);

    return tag;
  } finally {
    rl.close();
  }
}

release({ name : 'ziko'})