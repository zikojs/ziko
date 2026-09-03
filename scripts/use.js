import path from "node:path";
import {
  createTemplateSync,
} from "./pnpm-template-sync/index.js";

const root = path.resolve(
  import.meta.dirname,
  ".."
);

const SCAFFOLDERS = [
  "create-ziko/templates/*",
  "create-ufbr/templates/*",
];

const sync = createTemplateSync(
  root,
  SCAFFOLDERS
);

sync.prepare();
sync.restore();