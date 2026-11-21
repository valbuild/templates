<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in this project

A [Val Build](https://val.build) site on Next.js (App Router), started from the
minimal template. Content lives in `*.val.ts` files in this repository and is
edited either here or in Val Studio at `/val`.

<!-- val:codemap:start -->

## Code map

Where things are in this project as it was created from its template. If a file named here has moved, the files are right: correct the line in the same change.

**Pages** — URL, route file, the content it reads, what it renders:

- `/` — `src/app/(main)/page.tsx` · reads `src/content/home.val.ts`

Val Studio's own, leave alone: `src/app/(val)/`, `src/app/ValModulesClient.tsx`.

**Layout**:

- `src/app/(main)/layout.tsx` — around every page

**Styles**:

- `src/app/globals.css` — the site's stylesheet

**Content modules** (a file with `c.define`) not listed above: `settings.val.ts`.

<!-- val:codemap:end -->

## How to make the common changes

Every file to touch, in order. In Val Studio, a change to a `.val.ts` schema, a route or a dependency shows after a build, not in a quick preview.

### Add a field to the page

1. `src/content/home.val.ts`: the field in the schema and its value in the content under it.
2. `src/app/(main)/page.tsx`: render it (`home.<field>`).

For an image: `s.image().nullable()` with `null`, which an editor fills in the Studio; render `<img src={home.<field>.url} />`.

### Add a page

1. `src/content/<name>.val.ts`: copy `src/content/home.val.ts`; `c.define`'s first argument becomes `"/src/content/<name>.val.ts"`.
2. `src/app/(main)/<name>/page.tsx`: copy `src/app/(main)/page.tsx`, reading the new module.
3. `val.modules.ts`: add `{ def: () => import("./src/content/<name>.val") },`.

A new route needs a build.

For many pages of one kind, a router module beside the page instead: `src/app/(main)/<name>/[slug]/page.val.ts`, defined with `s.router(nextAppRouter, <schema>)` and keyed by URL (`/<name>/hello-world`), read in its `page.tsx` with `fetchValRoute(<module>, params)`. See "Adding pages" in README.md.

### Add a header, a footer or a style

- Around every page: in `src/app/(main)/layout.tsx`, beside `{children}` and inside `ValProvider`.
- Global CSS: `src/app/globals.css`. The example page's own look is the `styles` object at the bottom of `src/app/(main)/page.tsx`.

### Remove the example page

Delete `src/app/(main)/page.tsx` and `src/content/home.val.ts`, and remove the
`home.val` line from `val.modules.ts`. Everything left is Val's own setup.

## Rules that are not obvious

- `val.config.ts` exports `s` (schemas), `c` (`c.define`), `val` (helpers) and `nextAppRouter`.
- **Every content module is registered in `val.modules.ts`**, or the Studio does not know it.
- `export default c.define(...)` is written inline: assigned to a const first, it validates and then fails at publish time. Its first argument is the module's own path from the repository root, starting with `/`.
- A router module sits beside the `page.tsx` it serves, and is keyed by the URLs that page serves.
- Every page goes in the `(main)` group. `(val)` has a root layout of its own, so the site's layout is never wrapped around Val Studio.
- Read content in a Server Component with `fetchVal` / `fetchValRoute` from `src/val/val.rsc.ts`, in a Client Component with `useVal` / `useValRoute` from `src/val/val.client.ts`. Both give visitors the published content and an editor the draft, click-to-editable.
- Strings read through Val carry an invisible edit tag: use `val.raw()` wherever one must be exact (a URL, a `key`, a comparison, metadata).
- `settings.val.ts` (`s.settings()`) is filled in by editors in the Studio. Keep its content a plain object literal.
- There is no CSS framework, no component library and no media library: bring what you prefer.
- `ValModulesClient` must be rendered both in `(main)/layout.tsx` and on the
  `/val` page, or the Studio loads without your content.
- Working locally, run `npm run validate` after changing content: it checks the content against the schemas and fixes what it can.

<!-- val:mcp:start -->

## Content tools (MCP)

Val's content tools are served over MCP at `/api/mcp` (`src/app/api/mcp/route.ts`,
`src/val/mcp.ts`). In local development an agent can read, validate and edit
content there; a production build refuses unless the project is connected to
Val Build and OAuth is configured — see README.md.

<!-- val:mcp:end -->
