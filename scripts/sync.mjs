#!/usr/bin/env node
/*
 * Copies shared/ into the templates that use it.
 *
 *   node scripts/sync.mjs                    shared/ -> every template
 *   node scripts/sync.mjs --check            fail if any template differs from shared/
 *   node scripts/sync.mjs --pull <template>  that template -> shared/
 *
 * Why copies, and why they are committed: `npm create @valbuild` downloads a
 * template with degit, which copies one folder exactly as it is. A template
 * has to be complete on its own, so the shared code is IN it — and CI runs
 * `--check` so the copies cannot drift from shared/.
 *
 * `--pull` is for working in a template: edit the files there, run the app,
 * then pull the result back into shared/ and sync it to the other templates.
 *
 * A listed directory is mirrored, not merged: a file deleted from shared/ is
 * deleted from the template too.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHARED = path.join(ROOT, "shared");
const { templates } = JSON.parse(
  fs.readFileSync(path.join(ROOT, "templates.json"), "utf8"),
);

/** Every file under `entry` (a file or a directory), relative to `base`. */
function filesUnder(base, entry) {
  const full = path.join(base, entry);
  if (!fs.existsSync(full)) {
    return [];
  }
  if (fs.statSync(full).isFile()) {
    return [entry];
  }
  return fs
    .readdirSync(full, { recursive: true, withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) =>
      path.relative(base, path.join(dirent.parentPath, dirent.name)),
    )
    .sort();
}

/** What has to change for `to` to mirror `from`, for one template's paths. */
function plan(from, to, entries) {
  const writes = [];
  const deletes = [];
  for (const entry of entries) {
    const source = filesUnder(from, entry);
    if (source.length === 0) {
      throw new Error(
        `${path.relative(ROOT, path.join(from, entry))} does not exist`,
      );
    }
    for (const file of source) {
      const target = path.join(to, file);
      const content = fs.readFileSync(path.join(from, file));
      if (!fs.existsSync(target) || !fs.readFileSync(target).equals(content)) {
        writes.push({ file, content });
      }
    }
    const sourceSet = new Set(source);
    for (const file of filesUnder(to, entry)) {
      if (!sourceSet.has(file)) {
        deletes.push(file);
      }
    }
  }
  return { writes, deletes };
}

function apply(to, { writes, deletes }) {
  for (const { file, content } of writes) {
    fs.mkdirSync(path.dirname(path.join(to, file)), { recursive: true });
    fs.writeFileSync(path.join(to, file), content);
  }
  for (const file of deletes) {
    fs.rmSync(path.join(to, file));
  }
}

const [mode, arg] = process.argv.slice(2);

if (mode === "--pull") {
  const entries = templates[arg];
  if (!entries) {
    console.error(
      `Unknown template "${arg}". Templates: ${Object.keys(templates).join(", ")}`,
    );
    process.exit(1);
  }
  const changes = plan(path.join(ROOT, arg), SHARED, entries);
  apply(SHARED, changes);
  console.log(
    `Pulled ${arg} into shared/: ${changes.writes.length} written, ${changes.deletes.length} deleted. Run \`node scripts/sync.mjs\` to update the other templates.`,
  );
} else if (mode === "--check" || mode === undefined) {
  let drift = 0;
  for (const [template, entries] of Object.entries(templates)) {
    const to = path.join(ROOT, template);
    const changes = plan(SHARED, to, entries);
    if (mode === "--check") {
      for (const { file } of changes.writes) {
        console.error(`${template}/${file} differs from shared/${file}`);
      }
      for (const file of changes.deletes) {
        console.error(`${template}/${file} is not in shared/`);
      }
      drift += changes.writes.length + changes.deletes.length;
    } else {
      apply(to, changes);
      console.log(
        `${template}: ${changes.writes.length} written, ${changes.deletes.length} deleted`,
      );
    }
  }
  if (drift > 0) {
    console.error(
      `\n${drift} file(s) out of sync. Edit shared/ and run \`node scripts/sync.mjs\`, or pull a template's edits back with \`node scripts/sync.mjs --pull <template>\`.`,
    );
    process.exit(1);
  }
  if (mode === "--check") {
    console.log("Every template matches shared/.");
  }
} else {
  console.error(
    "Usage: node scripts/sync.mjs [--check | --pull <template>]",
  );
  process.exit(1);
}
