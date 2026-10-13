#!/usr/bin/env node
/*
 * Installs each template the way somebody who has just created a project
 * from it does, with every pnpm a person is likely to have.
 *
 *   node scripts/install-check.mjs                        every template, pnpm 10, 11, latest
 *   node scripts/install-check.mjs tanstack/full          one template
 *   PNPM_VERSIONS=11 node scripts/install-check.mjs       one pnpm
 *
 * The templates' own CI installs with `--frozen-lockfile` on pnpm 10, from a
 * warm cache, and that passes while a fresh install on a newer pnpm fails. Two
 * of those failures are what this is for:
 *
 * - **Build scripts.** pnpm 11 stopped reading `pnpm.onlyBuiltDependencies`
 *   from package.json, and fails (`ERR_PNPM_IGNORED_BUILDS`) on a dependency
 *   with a build script nobody approved. The approvals are `allowBuilds` in
 *   each template's pnpm-workspace.yaml. A warm store hides a missing one, so
 *   each install here gets an empty store of its own.
 * - **Release age.** pnpm 11 refuses a version less than a day old unless
 *   `minimumReleaseAgeExclude` names it. Every install here sets a day
 *   explicitly, so pnpm 10 enforces it too and a template bumped today fails
 *   here today. (`release-age.mjs --check` catches a stale list on any day.)
 *
 * The copy is what `npm create @valbuild` makes: the folder's files that git
 * does not ignore (so a new file is tested before it is committed), with
 * `{{projectName}}` filled in and the lock file kept.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FRAMEWORKS = ["tanstack", "nextjs"];
// pnpm 11's default; set explicitly so every version is held to it.
const MINIMUM_RELEASE_AGE_MINUTES = 1440;
const versions = (process.env.PNPM_VERSIONS ?? "10 11 latest")
  .split(/[\s,]+/)
  .filter(Boolean);

function allTemplates() {
  return FRAMEWORKS.flatMap((framework) =>
    fs
      .readdirSync(path.join(ROOT, framework), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `${framework}/${entry.name}`)
      .filter((folder) =>
        fs.existsSync(path.join(ROOT, folder, "package.json")),
      ),
  );
}

/** The template as a new project: its tracked files, placeholders filled in. */
function copyTemplate(folder, into) {
  const files = execFileSync(
    "git",
    [
      "ls-files",
      "-z",
      "--cached",
      "--others",
      "--exclude-standard",
      "--",
      folder,
    ],
    {
      cwd: ROOT,
      encoding: "utf8",
    },
  )
    .split("\0")
    .filter(Boolean);
  for (const file of files) {
    const from = path.join(ROOT, file);
    if (!fs.existsSync(from)) continue; // deleted, not yet committed
    const to = path.join(into, path.relative(folder, file));
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
  for (const file of ["package.json", "README.md"]) {
    const at = path.join(into, file);
    if (!fs.existsSync(at)) continue;
    const text = fs.readFileSync(at, "utf8");
    fs.writeFileSync(at, text.replaceAll("{{projectName}}", "my-val-site"));
  }
}

function install(folder, version) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "val-install-"));
  const project = path.join(work, "my-val-site");
  try {
    copyTemplate(folder, project);
    execFileSync(
      "npx",
      [
        "--yes",
        `pnpm@${version}`,
        "install",
        `--store-dir=${path.join(work, "store")}`,
        `--config.minimum-release-age=${MINIMUM_RELEASE_AGE_MINUTES}`,
      ],
      {
        cwd: project,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        // Not CI: a person's terminal, where pnpm does not imply
        // --frozen-lockfile, so a template whose lock file has drifted from
        // its package.json still installs (and is caught by the template's
        // own CI instead).
        env: { ...process.env, CI: "" },
      },
    );
    return null;
  } catch (error) {
    return [error.stdout, error.stderr, error.message]
      .filter(Boolean)
      .join("\n")
      .trim()
      .split("\n")
      .slice(-25)
      .join("\n");
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

const requested = process.argv.slice(2);
const folders = requested.length > 0 ? requested : allTemplates();
let failed = 0;
for (const folder of folders) {
  if (!fs.existsSync(path.join(ROOT, folder, "package.json"))) {
    console.error(`${folder}: not a template`);
    process.exit(2);
  }
  for (const version of versions) {
    const started = Date.now();
    const problem = install(folder, version);
    const seconds = Math.round((Date.now() - started) / 1000);
    if (problem === null) {
      console.log(`ok    ${folder}  pnpm@${version}  (${seconds}s)`);
    } else {
      failed++;
      console.error(`FAIL  ${folder}  pnpm@${version}\n${problem}\n`);
    }
  }
}
if (failed > 0) {
  console.error(`${failed} install(s) failed`);
  process.exit(1);
}
