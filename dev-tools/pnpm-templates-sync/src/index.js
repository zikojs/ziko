import fs from "node:fs";
import path from "node:path";

const DEPENDENCY_SECTIONS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];
const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
]);

export function readWorkspace(root) {
  const file = path.join(root, "pnpm-workspace.yaml");
  if (!fs.existsSync(file)) {
    throw new Error(
      `pnpm-workspace.yaml not found: ${file}`
    );
  }
  return {
    root,
    file,
    content: fs.readFileSync(file, "utf8"),
  };
}

export function readCatalog(workspace) {
  const catalog = {};
  let insideCatalog = false;
  for (const line of workspace.content.split(/\r?\n/)) {
    if (/^catalog:\s*$/.test(line)) {
      insideCatalog = true;
      continue;
    }
    if (insideCatalog) {
      if (/^\S/.test(line) && line.trim()) {
        insideCatalog = false;
        continue;
      }
      const match = line.match(/^\s{2}([^:#]+):\s*(.+)$/);
      if (!match) continue;
      const [, name, rawVersion] = match;
      let version = rawVersion.trim();
      if (
        (version.startsWith('"') && version.endsWith('"')) 
        ||
        (version.startsWith("'") && version.endsWith("'"))
      ) {
        version = version.slice(1, -1);
      }
      catalog[name.trim()] = version;
    }
  }
  return catalog;
}

export function resolveCatalog(name, catalog) {
  const version = catalog[name];
  if (!version) {
    throw new Error(
      `No catalog entry found for "${name}"`
    );
  }
  return version;
}

export function readWorkspacePackages(root) {
  const packages = new Map();
  function scan(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, {
      withFileTypes: true,
    })) {
      if ( entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
      const entryPath = path.join(dir, entry.name);
      if (!entry.isDirectory()) continue;
      const packageFile = path.join(entryPath, "package.json");
      if (fs.existsSync(packageFile)) {
        try {
          const pkg = JSON.parse(
            fs.readFileSync(packageFile, "utf8")
          );
          if (pkg.name && pkg.version) {
            packages.set(pkg.name, {
              name: pkg.name,
              version: pkg.version,
              path: entryPath,
            });
          }
        } catch {
          // Ignore invalid package.json
        }
      }
      scan(entryPath);
    }
  }
  scan(root);
  return packages;
}
export function resolveWorkspace(
  name,
  protocol,
  workspacePackages
) {
  const pkg = workspacePackages.get(name);
  if (!pkg) {
    throw new Error(
      `Workspace package "${name}" not found`
    );
  }
  switch (protocol) {
    case "*":
      return `^${pkg.version}`;
    case "^":
      return `^${pkg.version}`;
    case "~":
      return `~${pkg.version}`;
    default:
      throw new Error(
        `Unsupported workspace protocol: workspace:${protocol}`
      );
  }
}
export function resolvePackage(
  name,
  version,
  {
    catalog,
    workspacePackages,
  }
) {
  // catalog:
  if (version === "catalog:") {
    return resolveCatalog(
      name,
      catalog
    );
  }

  // workspace:*
  // workspace:^
  // workspace:~
  if (version.startsWith("workspace:")) {
    const protocol = version.slice(
      "workspace:".length
    );

    return resolveWorkspace(
      name,
      protocol,
      workspacePackages
    );
  }
  // Normal dependency
  return version;
}
function walkPackageJson(dir, callback) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
  })) {
    if ( entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkPackageJson(entryPath, callback);
      continue;
    }
    if (entry.name === "package.json") {
      callback(entryPath);
    }
  }
}
export function resolveTemplatePaths(root, patterns) {
  const result = [];
  for (const pattern of patterns) {
    const normalized = pattern
      .replaceAll("\\", "/")
      .replace(/^\/+/, "");
    const parts = normalized.split("/");
    const starIndex = parts.indexOf("*");
    // No wildcard
    if (starIndex === -1) {
      const dir = path.join(root, "packages", ...parts);
      if(fs.existsSync(dir) && fs.statSync(dir).isDirectory()) result.push(dir);
      continue;
    }
    // Wildcard
    const base = path.join(root, "packages", ...parts.slice(0, starIndex));
    if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) continue;
    for (const entry of fs.readdirSync(
      base,
      {
        withFileTypes: true,
      }
    )) {
      if (!entry.isDirectory()) continue;
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;
      result.push(
        path.join(base, entry.name)
      );
    }
  }
  return result;
}

function preparePackage(packageFile, resolver, root) {
  const pkg = JSON.parse(
    fs.readFileSync(packageFile, "utf8")
  );
  let changed = false;
  for (const section of DEPENDENCY_SECTIONS) {
    if (!pkg[section]) continue;
    for (const [name, version] of Object.entries(
      pkg[section]
    )) {
      const resolved = resolver(name, version);
      if (resolved === version) continue;
      pkg[section][name] = resolved;
      changed = true;
    }
  }
  if (!changed) return;
  fs.writeFileSync(
    packageFile,
    JSON.stringify(pkg, null, 2) + "\n"
  );

  console.log(
    `✓ Prepared ${path.relative(
      root,
      packageFile
    )}`
  );
}

export function prepareTemplates({
  root,
  templates,
  resolver,
}) {
  const templateDirs = resolveTemplatePaths(
      root,
      templates
    );

  for (const dir of templateDirs) {
    walkPackageJson(
      dir,
      packageFile => {
        preparePackage(
          packageFile,
          resolver,
          root
        );
      }
    );
  }
}

function restorePackage(packageFile, restoreMap, root) {
  const pkg = JSON.parse(
    fs.readFileSync(
      packageFile,
      "utf8"
    )
  );
  let changed = false;
  for (const section of DEPENDENCY_SECTIONS) {
    if (!pkg[section]) continue;
    for (const [name, version] of Object.entries(
      pkg[section]
    )) {
      const key = `${name}@${version}`;
      const original = restoreMap.get(key);
      if (!original) continue;
      if (version === original) continue;
      pkg[section][name] = original;
      changed = true;
    }
  }
  if (!changed) return;
  fs.writeFileSync(
    packageFile,
    JSON.stringify(pkg, null, 2) + "\n"
  );

  console.log(
    `✓ Restored ${path.relative(
      root,
      packageFile
    )}`
  );
}

export function restoreTemplates({
  root,
  templates,
}) {
  const workspace = readWorkspace(root);
  const catalog = readCatalog(workspace);
  const workspacePackages = readWorkspacePackages(root);
  const restoreMap = new Map();
  // Catalog
  for (const [name, version] of Object.entries(catalog)) {
    restoreMap.set(`${name}@${version}`, "catalog:");
  }
  // Workspace
  for (const [name, pkg] of workspacePackages) {
    restoreMap.set(`${name}@^${pkg.version}`,"workspace:*");
    restoreMap.set(`${name}@~${pkg.version}`,"workspace:~");
  }
  // Templates
  const templateDirs = resolveTemplatePaths(root, templates);
  for (const dir of templateDirs) {
    walkPackageJson(
      dir,
      packageFile => {
        restorePackage(
          packageFile,
          restoreMap,
          root
        );
      }
    );
  }
}
export function createTemplateSync(root, templates) {
  const workspace = readWorkspace(root);
  const catalog = readCatalog(workspace);
  const workspacePackages = readWorkspacePackages(root);
  const resolver = (name, version) =>
    resolvePackage(
      name,
      version,
      {
        catalog,
        workspacePackages,
      }
    );
  return {
    workspace,
    catalog,
    workspacePackages,
    prepare() {
      return prepareTemplates({
        root,
        templates,
        resolver,
      });
    },
    restore() {
      return restoreTemplates({
        root,
        templates,
      });
    },
  };
}