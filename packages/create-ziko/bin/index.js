#!/usr/bin/env node
console.log(' from create-ziko/bin')
import { createScaffolder } from "scafy";
import {
    DEFAULT_TEMPLATES,
    DEFAULT_LANGUAGE_NAMES,
    DEFAULT_PROJECT_TYPES
} from './config.js'

createScaffolder({
  templates : DEFAULT_TEMPLATES,
  languages : DEFAULT_LANGUAGE_NAMES,
  projectTypes : DEFAULT_PROJECT_TYPES,
  templatesDir : '../templates',
  // LIFECYCLE HOOKS
  hooks: {
    async beforeCreate(config) {
      console.log(`🚀 Preparing workspace for ${config.projectName}...`);
    },

    async afterCreate(config, { targetDir }) {
      console.log("⚡ Initializing Git repository...");
      try {
        execSync("git init", { cwd: targetDir, stdio: "ignore" });
        console.log("✓ Git repository initialized.");
      } catch {
        console.warn("Could not initialize Git repository.");
      }
    },
  },
}).run()