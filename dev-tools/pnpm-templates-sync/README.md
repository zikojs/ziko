# pnpm-templates-sync

Synchronize pnpm workspace dependencies inside package templates before running a command, then automatically restore the original template dependencies afterward.

It is useful for monorepos that contain **scaffolding/templates whose `package.json` files use pnpm-specific protocols**, such as:

* `catalog:`
* `workspace:*`
* `workspace:^`
* `workspace:~`

When publishing or otherwise processing those templates, `pnpm-templates-sync` temporarily converts these protocols into publishable dependency versions.

## Installation

```bash
pnpm add -D pnpm-templates-sync
```

## CLI

The simplest way to use the package is as a command wrapper.

```bash
node scripts/sync.js pnpm publish -r
```

The command is executed in three steps:

```text
prepare templates
      ↓
run command
      ↓
restore templates
```

For example:

```bash
node scripts/sync.js pnpm publish -r
```

is equivalent to:

```text
1. Resolve catalog/workspace dependencies
2. Temporarily update template package.json files
3. Run `pnpm publish -r`
4. Restore the original dependency specifications
```

### Using a package script

Add a script to the root `package.json`:

```json
{
  "scripts": {
    "sync": "node scripts/sync.js"
  }
}
```

Then:

```bash
pnpm sync pnpm publish -r
```

You can use the same wrapper for other commands:

```bash
pnpm sync pnpm build
```

```bash
pnpm sync pnpm pack
```

```bash
pnpm sync pnpm publish -r
```

The command after `sync` is passed directly to the wrapper.

## Why?

Suppose a template contains:

```json
{
  "dependencies": {
    "ziko": "workspace:*",
    "zod": "catalog:"
  }
}
```

These references are useful inside the monorepo, but they are not the dependency specifications you necessarily want to publish with the template.

Before running the command, the template can temporarily become:

```json
{
  "dependencies": {
    "ziko": "^2.0.0",
    "zod": "^4.0.0"
  }
}
```

After the command finishes, the original values are restored:

```json
{
  "dependencies": {
    "ziko": "workspace:*",
    "zod": "catalog:"
  }
}
```

The template source therefore remains unchanged.

# JavaScript API

The package also exposes the synchronization API directly.

```js
import {
  createTemplateSync,
} from "pnpm-templates-sync";
```

Create a synchronizer:

```js
const sync = createTemplateSync(
  root,
  [
    "create-ziko/templates/*",
  ]
);
```

## `createTemplateSync(root, templates)`

Creates a template synchronization instance.

### Parameters

#### `root`

The root directory of the pnpm workspace.

```js
const root = path.resolve(
  import.meta.dirname,
  ".."
);
```

#### `templates`

An array of template paths relative to the `packages` directory.

```js
[
  "create-ziko/templates/*",
  "create-ufbr/templates/*",
]
```

Wildcard paths are supported.

## `sync.prepare()`

Resolves pnpm-specific dependency protocols in template `package.json` files.

For example:

```json
{
  "dependencies": {
    "ziko": "workspace:*",
    "zod": "catalog:"
  }
}
```

can become:

```json
{
  "dependencies": {
    "ziko": "^2.0.0",
    "zod": "^4.0.0"
  }
}
```

The original files are not permanently changed because `sync.restore()` can reconstruct the original specifications.

## `sync.restore()`

Restores the pnpm dependency protocols.

For example:

```json
{
  "dependencies": {
    "ziko": "^2.0.0",
    "zod": "^4.0.0"
  }
}
```

is restored to:

```json
{
  "dependencies": {
    "ziko": "workspace:*",
    "zod": "catalog:"
  }
}
```

## Recommended usage

When calling `prepare()` manually, use `try/finally`:

```js
const sync = createTemplateSync(
  root,
  templates
);

sync.prepare();

try {
  // Your command
} finally {
  sync.restore();
}
```

This ensures that the templates are restored even when the command fails.

# Supported pnpm protocols

## Catalog

A dependency using:

```json
{
  "dependencies": {
    "zod": "catalog:"
  }
}
```

is resolved from the root `pnpm-workspace.yaml`:

```yaml
catalog:
  zod: ^4.0.0
```

Result:

```json
{
  "dependencies": {
    "zod": "^4.0.0"
  }
}
```

## Workspace protocol

The following workspace protocols are supported:

```text
workspace:*
workspace:^
workspace:~
```

For example:

```json
{
  "dependencies": {
    "ziko": "workspace:*"
  }
}
```

If the workspace package version is:

```json
{
  "name": "ziko",
  "version": "2.0.0"
}
```

the prepared dependency becomes:

```json
{
  "dependencies": {
    "ziko": "^2.0.0"
  }
}
```

Similarly:

```text
workspace:^ → ^2.0.0
workspace:~ → ~2.0.0
```

## Normal versions

Normal dependency specifications are left unchanged:

```json
{
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

remains:

```json
{
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

# Template configuration

Templates are specified relative to the workspace's `packages` directory.

For example:

```text
packages/
├── create-ziko/
│   └── templates/
│       ├── spa-js/
│       │   └── package.json
│       └── fbr-js/
│           └── package.json
└── ...
```

Configuration:

```js
const templates = [
  "create-ziko/templates/*",
];
```

will discover:

```text
packages/create-ziko/templates/spa-js
packages/create-ziko/templates/fbr-js
```

You can configure multiple template groups:

```js
const templates = [
  "create-ziko/templates/*",
  "create-ufbr/templates/*",
];
```

# Example

A typical repository structure:

```text
repo/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   └── create-ziko/
│       └── templates/
│           ├── spa-js/
│           │   └── package.json
│           └── fbr-js/
│               └── package.json
└── scripts/
    └── sync.js
```

`scripts/sync.js`:

```js
import path from "node:path";
import { spawn } from "node:child_process";

import {
  createTemplateSync,
} from "pnpm-templates-sync";

const root = path.resolve(
  import.meta.dirname,
  ".."
);

const SCAFFOLDERS = [
  "create-ziko/templates/*",
];

const sync = createTemplateSync(
  root,
  SCAFFOLDERS
);

const [command, ...args] =
  process.argv.slice(2);

if (!command) {
  console.error(
    "Usage: node scripts/sync.js <command> [...args]"
  );
  process.exit(1);
}

sync.prepare();

const child = spawn(
  command,
  args,
  {
    cwd: root,
    stdio: "inherit",
    shell: true,
  }
);

child.on("close", code => {
  try {
    sync.restore();
  } finally {
    process.exit(code ?? 1);
  }
});

child.on("error", error => {
  console.error(error);

  try {
    sync.restore();
  } finally {
    process.exit(1);
  }
});
```

Then:

```bash
node scripts/sync.js pnpm publish -r
```

# Design

`pnpm-templates-sync` deliberately does not permanently modify templates.

Its workflow is:

```text
                  ┌──────────────┐
                  │   Templates  │
                  └──────┬───────┘
                         │
                    prepare()
                         │
                         ▼
              ┌─────────────────────┐
              │ Publishable versions│
              └──────────┬──────────┘
                         │
                    run command
                         │
                         ▼
                    restore()
                         │
                         ▼
                  ┌──────────────┐
                  │   Templates  │
                  │   restored   │
                  └──────────────┘
```

This makes it particularly useful for monorepos where templates are maintained alongside the packages they depend on.

# Requirements

* Node.js
* pnpm workspace
* Templates containing `package.json` files
* A `pnpm-workspace.yaml` at the workspace root

# License

MIT
