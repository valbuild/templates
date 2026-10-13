#!/usr/bin/env node
/*
 * Keeps each template's `minimumReleaseAgeExclude` naming the Val packages in
 * its lock file.
 *
 *   node scripts/release-age.mjs --check   say which templates disagree
 *   node scripts/release-age.mjs           rewrite the lists from the lock files
 *
 * pnpm 11 and later refuse a version published less than a day ago
 * (`minimumReleaseAge`), so a template bumped to a Val release on the day it
 * came out cannot be installed until the next one. Each template exempts the
 * `@valbuild/*` versions it pins, by exact version rather than `@valbuild/*`,
 * so that it only waves through what it was tested with. That makes the list
 * one more thing every bump has to change, and this is what notices when one
 * does not.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FRAMEWORKS = ["tanstack", "nextjs"];
const KEY = "minimumReleaseAgeExclude";

/** Every template folder: one with a lock file under a framework folder. */
function templates() {
  return FRAMEWORKS.flatMap((framework) =>
    fs
      .readdirSync(path.join(ROOT, framework), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `${framework}/${entry.name}`)
      .filter((folder) =>
        fs.existsSync(path.join(ROOT, folder, "pnpm-lock.yaml")),
      ),
  );
}

/** Every `@valbuild/*` package in a lock file, as `name@version`, sorted. */
function lockedValPackages(folder) {
  const lock = fs.readFileSync(
    path.join(ROOT, folder, "pnpm-lock.yaml"),
    "utf8",
  );
  const start = lock.indexOf("\npackages:\n");
  if (start === -1) return [];
  const found = lock
    .slice(start)
    .matchAll(/^ {2}'?(@valbuild\/[^@'\s]+@[^('\s:]+)'?:/gm);
  return [...new Set([...found].map((match) => match[1]))].sort();
}

/** The workspace file, split around the exclude list. */
function readWorkspace(folder) {
  const file = path.join(ROOT, folder, "pnpm-workspace.yaml");
  const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const list = new RegExp(`^${KEY}:\\n((?: {2}- .*\\n?)*)`, "m").exec(text);
  if (!list) return { file, text, entries: null };
  const entries = list[1]
    .split("\n")
    .map((line) => line.replace(/^ {2}- /, "").replace(/^["']|["']$/g, ""))
    .filter((entry) => entry !== "")
    .sort();
  return {
    file,
    text,
    entries,
    before: text.slice(0, list.index),
    after: text.slice(list.index + list[0].length),
  };
}

function render(packages) {
  return `${KEY}:\n${packages.map((p) => `  - "${p}"\n`).join("")}`;
}

const args = process.argv.slice(2);
const check = args.length === 1 && args[0] === "--check";
if (args.length > 0 && !check) {
  console.error("usage: node scripts/release-age.mjs [--check]");
  process.exit(2);
}

const wrong = [];
for (const folder of templates()) {
  const wanted = lockedValPackages(folder);
  const workspace = readWorkspace(folder);
  if (JSON.stringify(workspace.entries) === JSON.stringify(wanted)) continue;
  if (check) {
    const has = new Set(workspace.entries ?? []);
    const want = new Set(wanted);
    wrong.push(
      `${folder}/pnpm-workspace.yaml: ${KEY} does not match pnpm-lock.yaml` +
        wanted
          .filter((p) => !has.has(p))
          .map((p) => `\n  missing ${p}`)
          .join("") +
        [...has]
          .filter((p) => !want.has(p))
          .map((p) => `\n  stale   ${p}`)
          .join(""),
    );
    continue;
  }
  const next =
    workspace.entries === null
      ? render(wanted) + (workspace.text ? `\n${workspace.text}` : "")
      : workspace.before + render(wanted) + workspace.after;
  fs.writeFileSync(workspace.file, next);
  console.log(`updated ${folder}/pnpm-workspace.yaml`);
}

if (wrong.length > 0) {
  for (const message of wrong) console.error(message);
  console.error("\nRun `node scripts/release-age.mjs` to rewrite them.");
  process.exit(1);
}
if (check) {
  console.log(`${KEY} matches the lock file in every template`);
}
