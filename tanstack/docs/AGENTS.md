# Working in this project

A [Val Build](https://val.build) site on [TanStack Start](https://tanstack.com/start)
(React). Content lives in `*.val.ts` files in this repository and is edited
either here or in Val Studio at `/val`.

## Where content lives

- `val.config.ts` — the Val instance: `s` (schemas), `c` (`c.define`), `val`
  (helpers), `tanstackRouter`.
- `val.modules.ts` — **every module has to be registered here.** A module that
  is not in this list does not exist as far as the Studio is concerned.
- `src/routes/*.val.ts` — a page's content. Named after the route file it sits
  beside, and its keys are the URLs that route serves.
- `src/components/**/*.val.ts` — the schemas of the components a page is built
  from.
- `src/media/*.val.ts` — the media libraries: every image (`images.val.ts`),
  video (`videos.val.ts`), downloadable file (`files.val.ts`), icon and custom
  font. A field never holds an upload of its own; it picks from a library with
  `s.image(imagesVal)`, `s.video(videosVal)` or `s.file(filesVal)`, and stores
  only `{ path }` — the size, type and default alt text are the library's. See
  [src/media/README.md](src/media/README.md).

## Reading content

Use the hooks from `src/val/val.hooks.ts` (`useVal`, `useValRoute`). They work
during server rendering and in the browser, and content read through them is
click-to-editable in the Studio.

Read on the server — `src/val/val.server.ts` — only when the content has to
exist before the component does: `head` metadata, a redirect, a `notFound()`
that must happen during the request. When you do, it **must** go through
`createServerFn`; a route `loader` runs in the browser too, so importing
`val.server` into one puts Node's `fs` in the client bundle.
`src/routes/_site.docs.$.tsx` is the worked example.

## Rules that are not obvious

- `export default c.define(...)` must be written inline. Assigning to a const
  and exporting that validates fine and then fails at publish time.
- The first argument to `c.define` is the module's own path from the repository
  root, starting with `/`. It has to match the file exactly.
- Route modules are named after their route file: `posts.$postId.tsx` is served
  by `posts.$postId.val.ts`. `.` and `/` both separate segments, `$param` is a
  parameter, `$` is a splat, and `index`, `route`, `(groups)` and `_pathless`
  layouts add no URL segment.
- `*.val.ts` files under `src/routes` are excluded from the route generator by
  `routeFileIgnorePattern` in `vite.config.ts` and `tsr.config.json`. Adding a
  content file needs no change there; removing that setting breaks the build.
- Every page of the site goes under the `_site` layout. `__root.tsx` is the
  shell for `/val` too, so nothing site-specific belongs in it.
- Run `npm run validate` after changing content. It type-checks the content
  against the schemas and fixes what it can.

## The docs

- A page is an entry of `src/routes/_site.docs.$.val.ts`, keyed by its URL
  (`/docs/...`, any depth); its schema is `src/components/docs/doc.val.ts`.
- The sidebar and Previous / Next are worked out by `docsOrder` in
  `src/components/docs/docsOrder.val.ts`, from each page's `group` and `next`.
  Previous is never stored. Do not add an order number or a nav module: the
  links are the order.
- `docsLinkProblems` is the module's validation: a page that is its own next,
  two pages with the same next, and cycles. Keep it and `docsOrder` agreeing,
  and run `pnpm test` after changing either.
- Read the order with `useDocs()`, which works on `val.raw` values — what the
  hooks return carries invisible edit tags.
- Code blocks render `val.raw(code)` with `val.attrs`, so a copied snippet has
  no edit tags in it. Keep it that way.

## Architecture

The components follow **TABS** — Typography, Atoms, Base, Sections. See
[src/components/README.md](src/components/README.md). Pages compose Sections and
nothing else.

## The theme

How the site looks is content: `src/theme/theme.val.ts`. An editor picks a
preset (`src/theme/presets.ts`) and overrides single choices — colours, fonts,
button shape, density. `resolveTheme` fills the gaps from the preset and
`themeCss` turns the result into CSS variables, which `_site.tsx` renders.

- **Components read tokens, never colours.** Use `bg-bg`, `text-fg`,
  `text-fg-muted`, `border-border`, `bg-subtle`, `text-link`, `bg-action`,
  `font-heading`, `rounded-theme`… (the list is `@theme inline` in
  `src/theme/theme.css`). A literal colour will be wrong in dark mode or on a
  brand section.
- **Backgrounds are surfaces.** A section sets `data-surface` (`default`,
  `muted`, `brand`, `inverse`) and everything inside follows. The surfaces are
  defined in `src/theme/surfaces.ts`, and `pnpm test` checks that every text
  colour on every surface clears WCAG AA for any brand colour. Run it after
  changing a surface or a ramp.
- **Nothing here imports the framework.** Router links and Val's renderers come
  from `src/framework.tsx`.
- `/styleguide` and `pnpm storybook` show every component under the theme.

<!-- val:mcp:start -->

## Content tools (MCP)

Val's content tools are served over MCP at `/api/mcp` (`src/routes/api/mcp.ts`,
`src/val/mcp.server.ts`). In local development an agent can read, validate and edit
content there; a production build refuses unless the project is connected to
Val Build and OAuth is configured — see README.md.

<!-- val:mcp:end -->
