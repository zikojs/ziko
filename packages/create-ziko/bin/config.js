import pc from "picocolors";

export const DEFAULT_TEMPLATES = {
  spa: { js: "spa-js", ts: "spa-ts", jsx: "spa-jsx", tsx: "spa-tsx" },
  fbr: { js: "fbr-js", ts: "fbr-ts", jsx: "fbr-jsx" },
  ssr: { js: "ssr-js", ts: "ssr-ts" },
};

export const DEFAULT_LANGUAGE_NAMES = {
  js: pc.yellowBright("JavaScript"),
  ts: pc.blueBright("TypeScript"),
  jsx: pc.cyanBright("JSX"),
  tsx: pc.magentaBright("TSX"),
};

export const DEFAULT_PROJECT_TYPES = [
  { name: "Single Page App", value: "spa" },
  { name: "Single Page App — File-based Router", value: "fbr" },
  { name: "Server-Side Rendering", value: "ssr" },
  {
    name: "Extra",
    value: "extra",
    // Custom action executed instead of standard template copying
    action: async (config, { targetDir }) => {
      console.log(`\n${pc.yellow("Executing custom setup script...")}\n`);
      // Run custom shell command, clone a remote git repo, or execute custom logic
      // e.g., execSync("git clone https://github.com/my-org/extra-template.git .", { cwd: targetDir });
    },
  },
];
