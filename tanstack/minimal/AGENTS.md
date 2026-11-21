# Working in this project

A [Val Build](https://val.build) site on [TanStack Start](https://tanstack.com/start)
(React), started from the minimal template: Val is wired in, and there is one
example page. Content lives in `*.val.ts` files in this repository and is edited
either here or in Val Studio at `/val`.

<!-- val:codemap:start -->

## Code map

Where things are in this project as it was created from its template. If a file named here has moved, the files are right: correct the line in the same change.

**Pages** — URL, route file, the content it reads, what it renders:

- `/` — `src/routes/_site.index.tsx` · reads `src/content/home.val.ts`

Val Studio's own, leave alone: `src/routes/__root.tsx`, `src/routes/api/val.$.ts`, `src/routes/val/`. `src/routeTree.gen.ts` is written by the build: never edit it.

**Layout**:

- `src/routes/_site.tsx` — around every page

**Styles**:

- `src/styles.css` — the site's stylesheet

**Content modules** (a file with `c.define`) not listed above: `settings.val.ts`.

<!-- val:codemap:end -->

## How to make the common changes

Every file to touch, in order. In Val Studio, a change to a `.val.ts` schema, a route or a dependency shows after a build, not in a quick preview.

### Add a field to the page

1. `src/content/home.val.ts`: the field in the schema and its value in the content under it.
2. `src/routes/_site.index.tsx`: render it (`home.<field>`).

For an image: `s.image().nullable()` with `null`, which an editor fills in the Studio; render `<img src={home.<field>.url} />`.

### Add a page

1. `src/content/<name>.val.ts`: copy `src/content/home.val.ts`; `c.define`'s first argument becomes `"/src/content/<name>.val.ts"`.
2. `src/routes/_site.<name>.tsx`: copy `src/routes/_site.index.tsx`; the route id becomes `createFileRoute("/_site/<name>")`, and it reads the new module.
3. `val.modules.ts`: add `{ def: () => import("./src/content/<name>.val") },`.

A new route needs a build; the build rewrites `src/routeTree.gen.ts` (locally, `npm run dev` does).

For many pages of one kind, a router module named after its route file instead: `src/routes/_site.<name>.$slug.val.ts`, defined with `s.router(tanstackRouter, <schema>)` and keyed by URL (`/<name>/hello-world`), read in `src/routes/_site.<name>.$slug.tsx` with `useValRoute(<module>, Route.useParams())`. See "Adding pages" in README.md.

### Add a header, a footer or a style

- Around every page: in `SiteLayout` in `src/routes/_site.tsx`, beside `<Outlet />` and inside `ValProvider`.
- Global CSS: `src/styles.css`. The example page's own look is the `styles` object at the bottom of `src/routes/_site.index.tsx`.

### Remove the example page

Delete `src/routes/_site.index.tsx` and `src/content/home.val.ts`, and remove
the `home.val` line from `val.modules.ts`. Everything left is Val's own setup.

## Rules that are not obvious

- `val.config.ts` exports `s` (schemas), `c` (`c.define`), `val` (helpers) and `tanstackRouter`.
- **Every content module is registered in `val.modules.ts`**, or the Studio does not know it.
- `export default c.define(...)` is written inline: assigned to a const first, it validates and then fails at publish time. Its first argument is the module's own path from the repository root, starting with `/`.
- A route's content is named after its route file (`.tsx` becomes `.val.ts`) and keyed by the URLs it serves. `.` and `/` separate segments, `$param` is a parameter, `$` a splat; `index`, `route`, `(groups)` and `_pathless` layouts add no segment.
- `routeFileIgnorePattern` in `vite.config.ts` and `tsr.config.json` keeps `*.val.ts` out of the route generator. Leave it.
- Every page goes under the `_site` layout. `__root.tsx` is the shell for `/val` too: nothing site-specific goes in it.
- Read content with `useVal` / `useValRoute` from `src/val/val.hooks.ts`: on the server and in the browser, click-to-editable. Read on the server (`src/val/val.server.ts`) only what must exist before the component does (`head`, a redirect, `notFound()`), and only **through `createServerFn`**: a `loader` runs in the browser too, and `val.server` would put Node's `fs` in the client bundle.
- Strings read through Val carry an invisible edit tag: use `val.raw()` wherever one must be exact (a URL, a `key`, a comparison, `<title>`). `.env.development` turns on analytics that warn in the browser console when a tag leaves React; fix that with `val.raw()`, not by turning them off.
- `settings.val.ts` (`s.settings()`) is filled in by editors in the Studio. Keep its content a plain object literal.
- There is no CSS framework, no component library and no media library: bring what you prefer.
- Working locally, run `npm run validate` after changing content: it checks the content against the schemas and fixes what it can.

<!-- val:mcp:start -->

## Content tools (MCP)

Val's content tools are served over MCP at `/api/mcp` (`src/routes/api/mcp.ts`,
`src/val/mcp.server.ts`). In local development an agent can read, validate and edit
content there; a production build refuses unless the project is connected to
Val Build and OAuth is configured — see README.md.

<!-- val:mcp:end -->
