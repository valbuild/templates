#!/usr/bin/env node
/*
 * Writes the code map in every template's AGENTS.md, and checks it.
 *
 *   node scripts/codemap.mjs            # rewrite the maps
 *   node scripts/codemap.mjs --check    # what CI runs
 *   node scripts/codemap.mjs --print tanstack/full
 *
 * Who it is for: an agent that changes a project's code and pays for every
 * look around. The Val Studio's assistant reads AGENTS.md from the project's
 * root into its prompt (cut at 20,000 characters, shared with CLAUDE.md and
 * whatever the project adds), and each file it has to list, search for or
 * open to FIND the code is a model round trip the person waits through. The
 * map says where things are, so the first reply can be the change.
 *
 * The map is derived, never typed: the routes from the route files, the
 * content module and components of each from its imports, the section types
 * from the `s.discriminatedUnion` calls, the tokens from `theme.css`, the
 * libraries from `val.modules.ts`. It goes between
 *
 *   <!-- val:codemap:start -->  ...  <!-- val:codemap:end -->
 *
 * which `npm create @valbuild` leaves alone: it cuts only `val:mcp` regions
 * (`removeMarkedSection` in valbuild/val, packages/create/src/features.ts).
 * For the same reason nothing that serves MCP is in the map — it has to stay
 * true in a project that declined MCP, and `catalog.mjs --check` fails a
 * mention of it outside the `val:mcp` region.
 *
 * `--check` fails when
 * - a map is not what the template's files say today (a renamed component, a
 *   new route, a section added to the union);
 * - AGENTS.md names a path that does not exist. That covers the recipes,
 *   which are prose and hand-written: every `src/...` path, every bare file
 *   name and every glob in backticks has to match a file. A path that is yet
 *   to be created is written with a placeholder (`src/routes/_site.<name>.tsx`)
 *   and is skipped;
 * - AGENTS.md is over the budget below.
 *
 * The few words of intent beside a file ("the site's name and navigation")
 * cannot be derived, so they are in NOTES here, keyed by path. A note whose
 * file is in no template fails the check too.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const START = "<!-- val:codemap:start -->";
const END = "<!-- val:codemap:end -->";
/*
 * The Studio cuts a project's instructions at 20,000 characters, and a
 * project's own additions and its CLAUDE.md come out of the same budget.
 */
const MAX_AGENTS_CHARS = 12_000;

const IGNORED_DIRS = new Set([
  "node_modules",
  ".output",
  ".next",
  ".nitro",
  ".val",
  ".tanstack",
  ".git",
  "dist",
  "storybook-static",
]);
const CODE_EXTENSIONS = [".ts", ".tsx"];

/** What a file is for, where its name does not say. Keyed by path. */
const NOTES = {
  "src/components/Header.tsx": "the site's name and navigation",
  "src/components/Footer.tsx": "the footer's text",
};

/** The field a library's entries are picked with. */
const PICKERS = {
  imagedir: "s.image",
  videodir: "s.video",
  filedir: "s.file",
  fontdir: "s.font",
};

/* ------------------------------------------------------------------------
 * Reading a template
 * --------------------------------------------------------------------- */

function walk(dir, relative = "") {
  const out = [];
  for (const entry of fs.readdirSync(path.join(dir, relative), {
    withFileTypes: true,
  })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const child = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(dir, child));
    else out.push(child);
  }
  return out.sort();
}

function loadTemplate(template, mcpPaths) {
  const dir = path.join(ROOT, template.path);
  const removed = (file) =>
    mcpPaths.some((entry) => file === entry || file.startsWith(`${entry}/`));
  const files = walk(dir).filter((file) => !removed(file));
  const fileSet = new Set(files);
  const cache = new Map();
  const read = (file) => {
    if (!cache.has(file)) {
      cache.set(file, fs.readFileSync(path.join(dir, file), "utf8"));
    }
    return cache.get(file);
  };

  /** The file a specifier names from `fromFile`, if it is one of ours. */
  const resolve = (fromFile, specifier) => {
    const clean = specifier.replace(/\?.*$/, "");
    let base;
    if (clean.startsWith(".")) {
      base = path.posix.normalize(
        path.posix.join(path.posix.dirname(fromFile), clean),
      );
    } else if (clean.startsWith("@/") || clean.startsWith("#/")) {
      base = `src/${clean.slice(2)}`;
    } else {
      return null;
    }
    const candidates = [
      base,
      ...CODE_EXTENSIONS.map((ext) => base + ext),
      ...CODE_EXTENSIONS.map((ext) => `${base}/index${ext}`),
    ];
    return candidates.find((candidate) => fileSet.has(candidate)) ?? null;
  };

  /** A file's imports of this project's own files: what, and under which names. */
  const importsOf = (file) => {
    const source = read(file);
    const out = [];
    const pattern =
      /import\s+(type\s+)?([\w$]+)?\s*,?\s*(?:\{([^}]*)\})?\s*(?:from\s*)?["']([^"']+)["']/g;
    for (const match of source.matchAll(pattern)) {
      const target = resolve(file, match[4]);
      if (target === null) continue;
      const names = (match[3] ?? "")
        .split(",")
        .map((name) =>
          name
            .trim()
            .replace(/^type\s+/, "")
            .replace(/\s+as\s+.*$/, ""),
        )
        .filter(Boolean);
      out.push({ target, default: match[2] ?? null, names });
    }
    return out;
  };

  return { template, dir, files, fileSet, read, importsOf };
}

const isVal = (file) => file.endsWith(".val.ts");
const isStory = (file) => /\.stories\.tsx?$/.test(file);
const isTest = (file) => /\.test\.tsx?$/.test(file);
const code = (text) => `\`${text}\``;
const baseName = (file) => path.posix.basename(file);
const componentName = (file) => baseName(file).replace(/\.tsx?$/, "");

/* ------------------------------------------------------------------------
 * Routes
 * --------------------------------------------------------------------- */

/** A TanStack route file's segments: `.` and `/` separate, `[.]` is a dot. */
function tanstackSegments(file) {
  const id = file.replace(/^src\/routes\//, "").replace(/\.tsx?$/, "");
  return id
    .replaceAll("[.]", "\u0000")
    .split(/[./]/)
    .map((segment) => segment.replaceAll("\u0000", "."));
}

function routesOf(project) {
  const { template, files, read } = project;
  const routes = [];
  if (template.framework === "tanstack") {
    for (const file of files) {
      if (!file.startsWith("src/routes/") || isVal(file)) continue;
      if (!/\.tsx?$/.test(file)) continue;
      const segments = tanstackSegments(file);
      const url =
        "/" +
        segments
          .filter(
            (segment) =>
              !segment.startsWith("_") &&
              !/^\(.*\)$/.test(segment) &&
              segment !== "index" &&
              segment !== "route",
          )
          .join("/");
      routes.push({
        file,
        url,
        root: segments[0] === "__root",
        layout: read(file).includes("<Outlet"),
      });
    }
  } else {
    for (const file of files) {
      const match =
        /^src\/app\/(.*?)\/?(page|layout|route|not-found)\.tsx?$/.exec(file);
      if (!match) continue;
      const segments = match[1] === "" ? [] : match[1].split("/");
      const url =
        "/" + segments.filter((segment) => !/^\(.*\)$/.test(segment)).join("/");
      routes.push({
        file,
        url,
        // Next.js gives each group its own root layout here: `(val)` has the
        // Studio's, and it is nobody's to change.
        root: false,
        studioGroup: segments[0] === "(val)",
        layout: match[2] === "layout",
        notFound: match[2] === "not-found",
      });
    }
  }
  for (const route of routes) {
    route.studio =
      route.root ||
      route.studioGroup === true ||
      /^\/(val|api\/val)(\/|$)/.test(route.url);
  }
  return routes;
}

/* ------------------------------------------------------------------------
 * Unions: the lists of section (or block) types
 * --------------------------------------------------------------------- */

/** The text between the parenthesis at `open` and the one that closes it. */
function balanced(source, open) {
  let depth = 0;
  for (let index = open; index < source.length; index++) {
    const ch = source[index];
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") {
      depth--;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  return "";
}

/** Split on the commas that are not inside brackets. */
function topLevelParts(text) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of text) {
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

const withoutComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const literalOf = (key, text) =>
  new RegExp(`\\b${key}:\\s*s\\s*\\.literal\\(\\s*"([^"]+)"`).exec(text)?.[1] ??
  null;

/** The type exported as `t.inferSchema<typeof name>`, if there is one. */
function inferredType(source, name) {
  return (
    new RegExp(
      `export type (\\w+) =\\s*t\\.inferSchema<\\s*typeof ${name}\\s*>`,
    ).exec(source)?.[1] ?? null
  );
}

function unionsOf(project) {
  const { files, read, importsOf } = project;
  const components = files.filter(
    (file) =>
      file.startsWith("src/components/") &&
      file.endsWith(".tsx") &&
      !isStory(file) &&
      !isTest(file),
  );
  /** The components that import `typeName` from `valFile`. */
  const renderersOf = (valFile, typeName) =>
    typeName === null
      ? []
      : components.filter((file) =>
          importsOf(file).some(
            (entry) =>
              entry.target === valFile && entry.names.includes(typeName),
          ),
        );

  const unions = [];
  for (const file of files) {
    if (!isVal(file) || !file.startsWith("src/")) continue;
    const source = withoutComments(read(file));
    const pattern = /export const (\w+) = s\s*\.discriminatedUnion\(/g;
    for (const match of source.matchAll(pattern)) {
      const name = match[1];
      const [keyPart, ...memberParts] = topLevelParts(
        balanced(source, match.index + match[0].length - 1),
      );
      const key = /"([^"]+)"/.exec(keyPart)?.[1] ?? "type";
      const imports = importsOf(file);
      const members = memberParts.map((part) => {
        if (!/^\w+$/.test(part)) {
          return { literal: literalOf(key, part), inline: true };
        }
        const from = imports.find((entry) => entry.names.includes(part));
        const schemaFile = from?.target ?? file;
        const schemaSource = withoutComments(read(schemaFile));
        const declared = new RegExp(`export const ${part} = `).exec(
          schemaSource,
        );
        return {
          literal: declared
            ? literalOf(key, schemaSource.slice(declared.index))
            : null,
          inline: false,
          schema: part,
          schemaFile,
          components: renderersOf(schemaFile, inferredType(schemaSource, part)),
        };
      });
      unions.push({
        name,
        file,
        key,
        members,
        renderers: renderersOf(file, inferredType(source, name)),
      });
    }
  }
  return unions;
}

/* ------------------------------------------------------------------------
 * The map
 * --------------------------------------------------------------------- */

function generate(project) {
  const { template, files, fileSet, read, importsOf } = project;
  const usedNotes = new Set();
  const note = (file) => {
    if (!(file in NOTES)) return "";
    usedNotes.add(file);
    return ` — ${NOTES[file]}`;
  };
  /** A path, or only its name where the line has already said the folder. */
  const within = (dir, file) =>
    code(path.posix.dirname(file) === dir ? baseName(file) : file);
  const lines = [];
  const routes = routesOf(project);
  const unions = unionsOf(project);
  const primitive = (file) =>
    /^src\/components\/(typography|atoms|base)\//.test(file);

  /* Pages ------------------------------------------------------------- */
  const routesDir =
    template.framework === "tanstack" ? "src/routes" : "src/app/(main)";
  const contentSeen = new Set();
  const pageLine = (route) => {
    const imports = importsOf(route.file);
    const content = imports.filter(
      (entry) => isVal(entry.target) && entry.default !== null,
    );
    const parts = [`${code(route.url)} — ${within(routesDir, route.file)}`];
    const reads = [];
    for (const entry of content) {
      // What the content module's schema is made of: the component schemas
      // it imports, and the exports it takes from them.
      const schemas = importsOf(entry.target)
        .filter(
          (from) =>
            isVal(from.target) && from.target.startsWith("src/components/"),
        )
        .map((from) => {
          const names = from.names.filter(
            (name) => !/Preview$/.test(name) && /^[a-z]/.test(name),
          );
          return names.length === 0
            ? null
            : `${names.map(code).join(", ")} from ${code(from.target)}`;
        })
        .filter(Boolean);
      // Said once: a module two routes read has one schema.
      const first = !contentSeen.has(entry.target);
      contentSeen.add(entry.target);
      reads.push(
        within(routesDir, entry.target) +
          (first && schemas.length > 0 ? ` (${schemas.join("; ")})` : ""),
      );
    }
    if (reads.length > 0) parts.push(`reads ${reads.join(", ")}`);
    const renders = imports
      .filter(
        (entry) =>
          entry.target.endsWith(".tsx") &&
          /^src\/(components\/[^/]+\/|styleguide\/)/.test(entry.target) &&
          !primitive(entry.target),
      )
      .map((entry) => code(entry.target));
    if (renders.length > 0) parts.push(`renders ${renders.join(", ")}`);
    return `- ${parts.join(" · ")}`;
  };

  const sitePages = routes.filter(
    (route) => !route.studio && !route.layout && !route.notFound,
  );
  const layouts = routes.filter((route) => !route.studio && route.layout);
  const studio = routes.filter((route) => route.studio);

  lines.push(
    `**Pages** — URL, route file, the content it reads, what it renders. A bare name is in ${code(`${routesDir}/`)}:`,
    "",
  );
  for (const route of sitePages) lines.push(pageLine(route));
  lines.push("");

  // A folder that holds nothing but the Studio's routes is named once.
  const own = [];
  for (const file of [
    ...studio.map((route) => route.file),
    ...["src/app/ValModulesClient.tsx"].filter((entry) => fileSet.has(entry)),
  ]) {
    const top = /^(src\/(?:routes|app)\/[^/]+)\//.exec(file)?.[1];
    const whole =
      top !== undefined &&
      studio.filter((route) => route.file.startsWith(`${top}/`)).length > 1 &&
      routes
        .filter((route) => route.file.startsWith(`${top}/`))
        .every((route) => route.studio);
    const entry = whole ? `${top}/` : file;
    if (!own.includes(entry)) own.push(entry);
  }
  const generated = ["src/routeTree.gen.ts"].filter((file) =>
    fileSet.has(file),
  );
  lines.push(
    `Val Studio's own, leave alone: ${own.map(code).join(", ")}.` +
      (generated.length > 0
        ? ` ${generated.map(code).join(", ")} is written by the build: never edit it.`
        : ""),
    "",
  );

  /* Layout ------------------------------------------------------------ */
  const topLevelComponents = files.filter((file) =>
    /^src\/components\/[^/]+\.tsx$/.test(file),
  );
  lines.push("**Layout**:", "");
  for (const layout of layouts) {
    const imports = importsOf(layout.file);
    const wraps = imports
      .filter((entry) => /^src\/components\/.*\.tsx$/.test(entry.target))
      .map((entry) => code(componentName(entry.target)));
    const covers =
      layout.url === "/"
        ? "every page"
        : `every page under ${code(layout.url)}`;
    lines.push(
      `- ${code(layout.file)} — around ${covers}` +
        (wraps.length > 0 ? `: renders ${wraps.join(", ")}` : ""),
    );
  }
  for (const file of topLevelComponents) {
    // The rest say what they are in their names.
    if (!(file in NOTES)) continue;
    const readsContent = importsOf(file).some((entry) => isVal(entry.target));
    lines.push(
      `- ${code(file)}${note(file)}` +
        (/\/(Header|Footer)\.tsx$/.test(file)
          ? readsContent
            ? " (reads a content module)"
            : ""
          : ""),
    );
  }
  lines.push("");

  /* Sections ---------------------------------------------------------- */
  const described = new Set();
  const named = unions
    .filter((union) => union.members.some((member) => !member.inline))
    .sort(
      (a, b) =>
        a.members.length - b.members.length ||
        (a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
    );
  const inline = unions.filter(
    (union) =>
      union.members.every((member) => member.inline) && !primitive(union.file),
  );
  for (const union of named) {
    const dir = path.posix.dirname(union.file);
    lines.push(
      `**Section types** — ${code(union.name)} in ${code(union.file)}` +
        (union.renderers.length > 0
          ? `, rendered by ${union.renderers.map(code).join(", ")}`
          : "") +
        `. Each ${code(union.key)}, its schema → its component, in ${code(`${dir}/`)}:`,
      "",
    );
    const again = [];
    for (const member of union.members) {
      if (member.inline) {
        lines.push(`- ${code(member.literal)} — written in the union itself`);
        continue;
      }
      if (described.has(member.schemaFile)) {
        again.push(member.literal);
        continue;
      }
      described.add(member.schemaFile);
      const stem = baseName(member.schemaFile).replace(".val.ts", "");
      lines.push(
        `- ${code(member.literal)} — ${within(dir, member.schemaFile)}` +
          (member.schema === stem ? "" : ` (${code(member.schema)})`) +
          ` → ${
            member.components.length > 0
              ? member.components.map((file) => within(dir, file)).join(", ")
              : "no component of its own"
          }`,
      );
    }
    if (again.length > 0) {
      lines.push(`- and, listed above: ${again.map(code).join(", ")}`);
    }
    lines.push("");
  }
  for (const union of inline) {
    lines.push(
      `**Block types** — ${code(union.name)} in ${code(union.file)}: ${union.members
        .map((member) => code(member.literal))
        .join(", ")}, each written in the union` +
        (union.renderers.length > 0
          ? `, rendered by ${union.renderers.map(code).join(", ")}`
          : "") +
        ".",
      "",
    );
  }

  /* Styles ------------------------------------------------------------ */
  const stylesheets = [
    ...new Set(
      layouts.flatMap((layout) =>
        importsOf(layout.file)
          .filter((entry) => entry.target.endsWith(".css"))
          .map((entry) => entry.target),
      ),
    ),
  ];
  lines.push("**Styles**:", "");
  for (const sheet of stylesheets) {
    const imported = [...read(sheet).matchAll(/@import\s+"([^"]+)"/g)].map(
      (match) =>
        match[1].startsWith(".")
          ? code(
              path.posix.normalize(
                path.posix.join(path.posix.dirname(sheet), match[1]),
              ),
            )
          : match[1],
    );
    lines.push(
      `- ${code(sheet)} — the site's stylesheet` +
        (imported.length > 0 ? `; imports ${imported.join(" and ")}` : ""),
    );
  }
  const themeCss = "src/theme/theme.css";
  if (fileSet.has(themeCss)) {
    const block = /@theme inline\s*\{([\s\S]*?)\}/.exec(read(themeCss))?.[1];
    const tokens = { color: [], font: [], radius: [], spacing: [] };
    for (const match of (block ?? "").matchAll(/--(\w+?)-([\w-]+):/g)) {
      tokens[match[1]]?.push(match[2]);
    }
    const utilities = [
      tokens.color.length > 0 &&
        `colours (\`bg-*\`, \`text-*\`, \`border-*\`) ${tokens.color.map(code).join(" ")}`,
      tokens.font.length > 0 &&
        tokens.font.map((name) => code(`font-${name}`)).join(" "),
      tokens.radius.length > 0 &&
        tokens.radius.map((name) => code(`rounded-${name}`)).join(" "),
      tokens.spacing.length > 0 &&
        `spacing ${tokens.spacing.map(code).join(" ")}`,
    ].filter(Boolean);
    lines.push(`- Tailwind tokens: ${utilities.join("; ")}`);
  }
  lines.push("");

  /* Content modules --------------------------------------------------- */
  const registered = [
    ...read("val.modules.ts").matchAll(/import\(\s*"\.\/([^"]+)"\s*\)/g),
  ].map((match) => `${match[1]}.ts`);
  const pageContent = new Set(
    sitePages.flatMap((route) =>
      importsOf(route.file)
        .filter((entry) => isVal(entry.target))
        .map((entry) => entry.target),
    ),
  );
  const media = [];
  const other = [];
  for (const file of registered) {
    if (!fileSet.has(file)) {
      throw new Error(
        `${template.path}: val.modules.ts registers ${file}, which does not exist`,
      );
    }
    const library = /s\s*\.(\w+dir)\(\s*"([^"]+)"/.exec(
      withoutComments(read(file)),
    );
    if (library) media.push({ file, kind: library[1] });
    else if (!pageContent.has(file)) other.push(file);
  }
  // A schema that is nobody's component and no module: shared fields.
  const looseSchemas = files.filter(
    (file) =>
      isVal(file) &&
      file.startsWith("src/") &&
      !file.startsWith("src/components/") &&
      !registered.includes(file),
  );
  lines.push(
    `**Content modules** (a file with ${code("c.define")}) not listed above: ${other.map(code).join(", ")}.` +
      (looseSchemas.length > 0
        ? ` Schemas only, not modules: ${looseSchemas.map(code).join(", ")}.`
        : ""),
  );
  if (media.length > 0) {
    // The name a library is imported under, wherever a schema picks from it.
    const picker = ({ file, kind }) =>
      `${PICKERS[kind]}(${baseName(file).replace(".val.ts", "")}Val)`;
    lines.push(
      "",
      `**Media libraries** in ${code("src/media/")}, and the field that picks from each: ${media
        .map(
          (library) =>
            `${within("src/media", library.file)} ${code(picker(library))}`,
        )
        .join("; ")}.`,
    );
  }

  while (lines.at(-1) === "") lines.pop();
  return { text: lines.join("\n"), usedNotes };
}

/* ------------------------------------------------------------------------
 * AGENTS.md
 * --------------------------------------------------------------------- */

const HEADING = "## Code map";
const PREAMBLE =
  "This project as it was created from its template. Where a file has since moved, the files are right: correct the line in the same change.";

function withMap(agents, map) {
  const start = agents.indexOf(START);
  const end = agents.indexOf(END);
  if (
    start === -1 ||
    end === -1 ||
    end < start ||
    agents.indexOf(START, start + 1) !== -1 ||
    agents.indexOf(END, end + 1) !== -1
  ) {
    return null;
  }
  return (
    agents.slice(0, start) +
    `${START}\n\n${HEADING}\n\n${PREAMBLE}\n\n${map}\n\n${END}` +
    agents.slice(end + END.length)
  );
}

/** The paths AGENTS.md names, in backticks, that ought to exist. */
function namedPaths(agents) {
  // `next dev` writes this block, about files in node_modules.
  const text = agents.replace(
    /<!-- BEGIN:nextjs-agent-rules -->[\s\S]*?<!-- END:nextjs-agent-rules -->/,
    "",
  );
  const out = new Set();
  for (const match of text.matchAll(/`([^`\n]+)`/g)) {
    const token = match[1].trim();
    // A file that is yet to be made is written with a placeholder.
    if (/[<>{}\s]|\.\.\./.test(token)) continue;
    if (/^(src|public|\.github|\.storybook)\//.test(token)) {
      out.add(token);
    } else if (
      !token.includes("/") &&
      !token.startsWith(".") &&
      /^[\w.$()[\]*-]+\.(tsx?|css|json|md|mjs)$/.test(token)
    ) {
      out.add(token);
    }
  }
  return [...out];
}

function globToRegExp(glob) {
  const escaped = glob
    .replace(/[.+^$()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "\u0000")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, "(?:.*/)?");
  return new RegExp(`^${escaped}$`);
}

function missingPaths(project, agents) {
  const all = walk(project.dir);
  const dirs = new Set();
  for (const file of all) {
    let dir = path.posix.dirname(file);
    while (dir !== ".") {
      dirs.add(dir);
      dir = path.posix.dirname(dir);
    }
  }
  const baseNames = new Set(all.map(baseName));
  return namedPaths(agents).filter((token) => {
    if (token.includes("*")) {
      const pattern = globToRegExp(token);
      return !all.some((file) => pattern.test(file));
    }
    if (!token.includes("/")) return !baseNames.has(token);
    const plain = token.replace(/\/$/, "");
    return !all.includes(plain) && !dirs.has(plain);
  });
}

/* ------------------------------------------------------------------------
 * Run
 * --------------------------------------------------------------------- */

const args = process.argv.slice(2);
const check = args.includes("--check");
const printIndex = args.indexOf("--print");
const catalog = JSON.parse(
  fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"),
);

const KNOWN_ARGS = new Set(["--check", "--print"]);
const unknown = args.filter(
  (arg, index) => !KNOWN_ARGS.has(arg) && args[index - 1] !== "--print",
);
if (unknown.length > 0 || (printIndex !== -1 && !args[printIndex + 1])) {
  console.error(
    "Usage: node scripts/codemap.mjs [--check | --print <template path>]",
  );
  process.exit(2);
}

const errors = [];
const usedNotes = new Set();
if (!Array.isArray(catalog.templates) || catalog.templates.length === 0) {
  errors.push("catalog.json lists no templates: there is nothing to check.");
}
let written = 0;
for (const template of catalog.templates) {
  const mcp = template.features?.mcp?.paths ?? [];
  const project = loadTemplate(template, mcp);
  const { text: map, usedNotes: used } = generate(project);
  // A map the rules above could not read is worse than none: say so, rather
  // than write `null` or an empty list into a prompt.
  if (!/^- `\/` — /m.test(map)) {
    errors.push(
      `${template.path}: no route serves "/": the routes were not read`,
    );
  }
  if (/`(null|undefined)`|: \.$/m.test(map)) {
    errors.push(
      `${template.path}: the map has a value that could not be read (\`null\`). scripts/codemap.mjs needs to learn how this template writes it.`,
    );
  }
  used.forEach((file) => usedNotes.add(file));
  if (printIndex !== -1) {
    if (args[printIndex + 1] === template.path) console.log(map);
    continue;
  }
  const agentsPath = path.join(project.dir, "AGENTS.md");
  const where = `${template.path}/AGENTS.md`;
  // A checkout with CRLF line endings is the same file.
  const agents = fs.readFileSync(agentsPath, "utf8").replaceAll("\r\n", "\n");
  const next = withMap(agents, map);
  if (next === null) {
    errors.push(`${where}: needs exactly one ${START}, then one ${END}`);
    continue;
  }
  if (next !== agents) {
    if (check) {
      errors.push(
        `${where}: the code map is not what the template's files say. Run \`node scripts/codemap.mjs\`.`,
      );
    } else {
      fs.writeFileSync(agentsPath, next);
      written++;
    }
  }
  for (const missing of missingPaths(project, next)) {
    errors.push(
      `${where}: names \`${missing}\`, which is not in the template. Correct it, or write a path that is yet to be made with a placeholder (\`<name>\`).`,
    );
  }
  if (next.length > MAX_AGENTS_CHARS) {
    errors.push(
      `${where}: ${next.length} characters, over the ${MAX_AGENTS_CHARS} it may be. The Studio cuts a project's instructions at 20,000, and the project's own share that.`,
    );
  }
}
if (printIndex === -1) {
  for (const file of Object.keys(NOTES)) {
    if (!usedNotes.has(file)) {
      errors.push(
        `scripts/codemap.mjs: NOTES has ${file}, which no template's map lists.`,
      );
    }
  }
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log(
    check
      ? `The code map in every template's AGENTS.md is what its files say, and every path named exists.`
      : `Code maps written: ${written} changed.`,
  );
}
