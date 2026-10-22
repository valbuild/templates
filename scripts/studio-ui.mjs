#!/usr/bin/env node
/*
 * Checks that every mirrored template declares `@valbuild/ui` itself, at the
 * one version its lock file has.
 *
 *   node scripts/studio-ui.mjs --check
 *
 * `@valbuild/ui` is the Studio's bundle, and to a template it is only a
 * TRANSITIVE dependency, of `@valbuild/tanstack`. The platform builds a site's
 * dependency layer from what the project declares, so when admin.val.build
 * wires a mirror up (`wireUp` in `@valbuild/tanstack-build`) it declares
 * `@valbuild/ui` for any project that has not. Every site /new made then had
 * a `package.json` with one dependency the template's did not, so no
 * template's lock file matched it, and Settings -> Updates said the site had
 * no lockfile on record.
 *
 * Declared here, the wiring has nothing to add: a new site's `package.json` is
 * the template's, and so is its lock file. At the version `@valbuild/tanstack`
 * installs, so there is one copy of the Studio, not two -- which is why a bump
 * of `@valbuild/tanstack` has to move this one too, and why this checks it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UI = "@valbuild/ui";

const args = process.argv.slice(2);
if (args.length !== 1 || args[0] !== "--check") {
  console.error("usage: node scripts/studio-ui.mjs --check");
  process.exit(2);
}

/** The folders the platform seeds sites from. */
const { mirrors } = JSON.parse(
  fs.readFileSync(path.join(ROOT, "mirrors.json"), "utf8"),
);

/** Every version of `@valbuild/ui` a lock file holds, sorted. */
function lockedUiVersions(folder) {
  const lock = fs.readFileSync(
    path.join(ROOT, folder, "pnpm-lock.yaml"),
    "utf8",
  );
  const start = lock.indexOf("\npackages:\n");
  if (start === -1) return [];
  const found = lock
    .slice(start)
    .matchAll(/^ {2}'?@valbuild\/ui@([^('\s:]+)'?:/gm);
  return [...new Set([...found].map((match) => match[1]))].sort();
}

const wrong = [];
for (const folder of Object.keys(mirrors)) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(ROOT, folder, "package.json"), "utf8"),
  );
  const declared = manifest.dependencies?.[UI];
  const locked = lockedUiVersions(folder);
  if (declared === undefined) {
    wrong.push(
      `${folder}/package.json: ${UI} is not in dependencies. Declare it at ` +
        `${locked.join(" or ") || "the version @valbuild/tanstack depends on"}.`,
    );
  } else if (locked.length !== 1) {
    wrong.push(
      `${folder}/pnpm-lock.yaml: ${UI} is locked at ${locked.join(", ") || "no version"}; ` +
        `there should be exactly one, the version @valbuild/tanstack depends on.`,
    );
  } else if (declared !== locked[0]) {
    wrong.push(
      `${folder}/package.json: ${UI} is declared as ${declared}, ` +
        `but the lock file has ${locked[0]}.`,
    );
  }
}

if (wrong.length > 0) {
  for (const message of wrong) console.error(message);
  console.error(
    `\nSet ${UI} to the version @valbuild/tanstack depends on ` +
      `(npm view @valbuild/tanstack@<version> dependencies) and run pnpm install.`,
  );
  process.exit(1);
}
console.log(
  `${UI} is declared at its locked version in every mirrored template`,
);
