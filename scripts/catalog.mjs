#!/usr/bin/env node
/*
 * Checks catalog.json against the templates it describes.
 *
 *   node scripts/catalog.mjs --check
 *
 * The catalog is read at run time by `npm create @valbuild` and by
 * admin.val.build/new, so a mistake in it is not caught by any template's own
 * build: it shows up as a project that was created wrong. Every claim it makes
 * is checked here instead:
 *
 * - each template's folder exists, and its icon and screenshots do;
 * - every path a feature removes exists, and stays inside the template;
 * - every dependency it removes is one the template declares;
 * - every doc it cuts has exactly one pair of `val:<feature>` markers;
 * - the script it regenerates with exists, and so do the files it rewrites;
 * - and, the one that matters most, nothing LEFT after a feature is removed
 *   still imports what was removed — a file or a dependency. That is the
 *   project that would not build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FRAMEWORKS = ["tanstack", "nextjs"];
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
const IGNORED_DIRS = new Set([
  "node_modules",
  ".output",
  ".next",
  ".val",
  ".tanstack",
  "dist",
  "storybook-static",
]);

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

const catalog = JSON.parse(
  fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"),
);

if (catalog.version !== 1) {
  fail("catalog.json", `unknown version ${JSON.stringify(catalog.version)}`);
}

/** Relative, forward slashes, and never climbing out of where it is resolved. */
function isSafeRelativePath(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    !value.startsWith("/") &&
    !value.includes("\\") &&
    !value.split("/").some((segment) => segment === ".." || segment === "")
  );
}

/** Every source file under `dir`, relative to it. */
function sourceFiles(dir, relative = "") {
  const out = [];
  for (const entry of fs.readdirSync(path.join(dir, relative), {
    withFileTypes: true,
  })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const child = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...sourceFiles(dir, child));
    } else if (SOURCE_EXTENSIONS.includes(path.extname(entry.name))) {
      out.push(child);
    }
  }
  return out;
}

/** The module specifiers a file imports, statically or dynamically. */
function importsOf(source) {
  const specifiers = [];
  const pattern = /(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g;
  for (const match of source.matchAll(pattern)) {
    specifiers.push(match[1]);
  }
  return specifiers;
}

/** The package a bare specifier names: `@scope/name/sub` -> `@scope/name`. */
function packageOf(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/** Whether `file` (relative to the template) is, or is inside, a removed path. */
function isRemoved(file, removed) {
  return removed.some(
    (entry) => file === entry || file.startsWith(`${entry}/`),
  );
}

/** What a relative import from `fromFile` resolves to, as candidates. */
function candidatesFor(fromFile, specifier) {
  const base = path.posix.normalize(
    path.posix.join(path.posix.dirname(fromFile), specifier),
  );
  return [
    base,
    ...SOURCE_EXTENSIONS.map((ext) => base + ext),
    ...SOURCE_EXTENSIONS.map((ext) => `${base}/index${ext}`),
  ];
}

const ids = new Set();
for (const template of catalog.templates ?? []) {
  const where = `catalog.json ${template.id ?? "(no id)"}`;
  if (typeof template.id !== "string" || !/^[a-z0-9-]+$/.test(template.id)) {
    fail(where, "id must be lower case letters, digits and dashes");
  } else if (ids.has(template.id)) {
    fail(where, "id is used twice");
  }
  ids.add(template.id);
  if (!FRAMEWORKS.includes(template.framework)) {
    fail(where, `framework must be one of ${FRAMEWORKS.join(", ")}`);
  }
  for (const key of ["name", "description"]) {
    if (typeof template[key] !== "string" || template[key].length === 0) {
      fail(where, `${key} is missing`);
    }
  }
  if (
    !isSafeRelativePath(template.path) ||
    !fs.existsSync(path.join(ROOT, template.path, "package.json"))
  ) {
    fail(
      where,
      `path ${JSON.stringify(template.path)} is not a template folder`,
    );
    continue;
  }
  for (const asset of [template.icon, ...(template.screenshots ?? [])]) {
    if (!isSafeRelativePath(asset) || !fs.existsSync(path.join(ROOT, asset))) {
      fail(where, `${JSON.stringify(asset)} does not exist`);
    }
  }

  const dir = path.join(ROOT, template.path);
  const pkg = JSON.parse(
    fs.readFileSync(path.join(dir, "package.json"), "utf8"),
  );
  const declared = { ...pkg.dependencies, ...pkg.devDependencies };
  const files = sourceFiles(dir);

  /*
   * `skipped` are the files whose own imports do not matter: the removed ones,
   * and a file that is about to be replaced whole.
   */
  // Rewritten by the regenerate script once a feature is gone, so what they
  // import today is not what they will import then.
  const generated = template.regenerate?.files ?? [];
  const checkRemoval = (
    feature,
    removedPaths,
    removedDependencies,
    skipped = removedPaths,
  ) => {
    for (const entry of removedPaths) {
      if (!isSafeRelativePath(entry)) {
        fail(
          where,
          `${feature}: ${JSON.stringify(entry)} is not a relative path inside the template`,
        );
      } else if (!fs.existsSync(path.join(dir, entry))) {
        fail(where, `${feature}: ${entry} does not exist`);
      }
    }
    for (const name of removedDependencies) {
      if (!(name in declared)) {
        fail(where, `${feature}: ${name} is not a dependency of the template`);
      }
    }
    for (const file of files) {
      if (isRemoved(file, skipped) || generated.includes(file)) continue;
      for (const specifier of importsOf(
        fs.readFileSync(path.join(dir, file), "utf8"),
      )) {
        if (specifier.startsWith(".")) {
          if (
            candidatesFor(file, specifier).some((candidate) =>
              isRemoved(candidate, removedPaths),
            )
          ) {
            fail(
              where,
              `${feature}: ${file} imports ${specifier}, which is removed`,
            );
          }
        } else if (removedDependencies.includes(packageOf(specifier))) {
          fail(
            where,
            `${feature}: ${file} imports ${specifier}, whose package is removed`,
          );
        }
      }
    }
  };

  const mcp = template.features?.mcp;
  if (mcp) {
    checkRemoval("mcp", mcp.paths ?? [], mcp.dependencies ?? []);
    for (const doc of mcp.docs ?? []) {
      const docPath = path.join(dir, doc);
      if (!isSafeRelativePath(doc) || !fs.existsSync(docPath)) {
        fail(where, `mcp: doc ${JSON.stringify(doc)} does not exist`);
        continue;
      }
      const text = fs.readFileSync(docPath, "utf8");
      const starts = text.split("<!-- val:mcp:start -->").length - 1;
      const ends = text.split("<!-- val:mcp:end -->").length - 1;
      if (
        starts !== 1 ||
        ends !== 1 ||
        text.indexOf("<!-- val:mcp:end -->") <
          text.indexOf("<!-- val:mcp:start -->")
      ) {
        fail(
          where,
          `mcp: ${doc} needs exactly one val:mcp:start, then one val:mcp:end`,
        );
      }
    }
  }
  const imageUploads = template.features?.imageUploads;
  if (imageUploads) {
    if (!mcp) {
      fail(
        where,
        "imageUploads needs mcp: the tools are served by its endpoint",
      );
    }
    if (
      !isSafeRelativePath(imageUploads.file) ||
      !fs.existsSync(path.join(dir, imageUploads.file))
    ) {
      fail(
        where,
        `imageUploads: ${JSON.stringify(imageUploads.file)} does not exist`,
      );
    }
    // The file is replaced, not removed: importing it stays fine, and only the
    // dependencies it is replaced to be rid of are at risk elsewhere.
    checkRemoval("imageUploads", [], imageUploads.dependencies ?? [], [
      imageUploads.file,
    ]);
  }
  if (template.regenerate !== undefined) {
    if (!(template.regenerate.script in (pkg.scripts ?? {}))) {
      fail(
        where,
        `regenerate: there is no "${template.regenerate.script}" script`,
      );
    }
    for (const file of generated) {
      if (!isSafeRelativePath(file) || !fs.existsSync(path.join(dir, file))) {
        fail(where, `regenerate: ${JSON.stringify(file)} does not exist`);
      }
    }
  }
}

if (!process.argv.includes("--check")) {
  console.log("Usage: node scripts/catalog.mjs --check");
  process.exit(2);
}
if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `catalog.json describes ${ids.size} templates, and every one checks out.`,
);
