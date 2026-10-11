#!/usr/bin/env node
/*
 * Turns a template's `val.config.ts` into the one a project in the Val app
 * needs: `initVal({ files: { remote: true }, ... })`.
 *
 *   node scripts/app-config.mjs <folder>   rewrite <folder>/val.config.ts
 *   node scripts/app-config.mjs --check    check every folder in mirrors.json
 *
 * Why the templates here do not say it themselves: the same folder is made
 * into a project two ways, and only one of them is the Val app.
 *
 * - `npm create @valbuild` downloads the folder from this repository. That
 *   project keeps its media in its own repository, under /public, like any
 *   other -- and with `files: { remote: true }` every image would fail
 *   validation until it was uploaded, which needs a Val project the person
 *   may not have yet.
 * - admin.val.build/new copies a MIRROR (see mirrors.json and
 *   scripts/mirror.sh). That project runs in the Val app (`VAL_ENV=app`),
 *   which refuses to start without `files: { remote: true }`: there is no
 *   repository there for an upload to go into. `val publish` refuses too.
 *
 * So the mirror is where the setting is added, by this script, on the copy
 * that is pushed. Images already in the template are local paths then, which
 * the Studio does not block on (`image:upload-remote`); `val validate --fix`
 * uploads them.
 *
 * It edits text rather than parsing it, so it only does what it can see
 * plainly: one `initVal({`, and no `files` key yet. Anything else is refused,
 * and `--check` (which mirror.sh runs before pushing anything) is how a
 * template that has stopped matching is found before it reaches a mirror.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const COMMENT = [
  "// This project runs in the Val app, which keeps every image, file and video",
  "// on Val's remote content host: there is no repository there for an upload",
  "// to go into, so the app will not start without this. Images that were",
  "// already in the template are uploaded by `npx val validate --fix`.",
];

/**
 * The config with `files: { remote: true }` as the first key of `initVal`'s
 * object, or a string saying why that cannot be done plainly.
 */
function withRemoteFiles(source) {
  const calls = [...source.matchAll(/\binitVal\s*\(\s*\{/g)];
  if (calls.length !== 1) {
    return `expected one \`initVal({\`, found ${calls.length}`;
  }
  if (/\bfiles\s*:/.test(source)) {
    return (
      "already has a `files` key. A template leaves `files` out, because " +
      "`npm create @valbuild` keeps media in the project, and this script " +
      "adds `files: { remote: true }` to the mirror: remove it from the template"
    );
  }
  const call = calls[0];
  const open = call.index + call[0].length;
  // Indented like the key that is already first, so the line does not arrive
  // looking foreign.
  const indent = /^\n([ \t]+)\S/.exec(source.slice(open))?.[1];
  if (indent === undefined) {
    return "`initVal({` is not followed by an indented line";
  }
  const lines = [...COMMENT, "files: { remote: true },"]
    .map((line) => `\n${indent}${line}`)
    .join("");
  return { source: source.slice(0, open) + lines + source.slice(open) };
}

function rewrite(folder) {
  const file = path.join(folder, "val.config.ts");
  if (!fs.existsSync(file)) {
    return `${file}: no val.config.ts`;
  }
  const result = withRemoteFiles(fs.readFileSync(file, "utf8"));
  if (typeof result === "string") {
    return `${file}: ${result}`;
  }
  return result;
}

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === "--check") {
  const { mirrors } = JSON.parse(
    fs.readFileSync(path.join(ROOT, "mirrors.json"), "utf8"),
  );
  const errors = Object.keys(mirrors)
    .map((folder) => rewrite(path.join(ROOT, folder)))
    .filter((result) => typeof result === "string");
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  console.log(
    `val.config.ts can be made remote in all ${Object.keys(mirrors).length} mirrored templates`,
  );
} else if (args.length === 1 && !args[0].startsWith("-")) {
  const result = rewrite(path.resolve(args[0]));
  if (typeof result === "string") {
    console.error(result);
    process.exit(1);
  }
  fs.writeFileSync(
    path.join(path.resolve(args[0]), "val.config.ts"),
    result.source,
  );
} else {
  console.error(
    "usage: node scripts/app-config.mjs <folder> | node scripts/app-config.mjs --check",
  );
  process.exit(2);
}
