<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in this project

A [Val Build](https://val.build) site on Next.js (App Router), started from the
full template. Content lives in `*.val.ts` files in this repository and is
edited either here or in Val Studio at `/val`.

## Where content lives

- `val.config.ts` — the Val instance: `s` (schemas), `c` (`c.define`), `val`
  (helpers), `nextAppRouter`.
- `val.modules.ts` — **every module has to be registered here.** A module that
  is not in this list does not exist as far as the Studio is concerned.
- `src/app/(main)/**/page.val.ts` — a page's content, a router module beside
  the page it serves, keyed by the URLs that page serves.
- `src/components/**/*.val.ts` — the schemas of the components a page is built
  from.
- `src/media/*.val.ts` — the media libraries: every image (`images.val.ts`),
  video (`videos.val.ts`), downloadable file (`files.val.ts`), icon and custom
  font. A field never holds an upload of its own; it picks from a library with
  `s.image(imagesVal)`, `s.video(videosVal)` or `s.file(filesVal)`, and stores
  only `{ path }` — the size, type and default alt text are the library's. See
  [src/media/README.md](src/media/README.md).

## Reading content

- In a Server Component: `fetchVal` / `fetchValRoute` from `src/val/val.rsc.ts`.
- In a Client Component: `useVal` / `useValRoute` from `src/val/val.client.ts`.

Both give published content to visitors and the editor's draft in draft mode,
and what they return is click-to-editable on the page.

## Rules that are not obvious

- `export default c.define(...)` must be written inline. Assigning to a const
  and exporting that validates fine and then fails at publish time.
- The first argument to `c.define` is the module's own path from the repository
  root, starting with `/`. It has to match the file exactly.
- Every page of the site goes in the `(main)` group. `(val)` has a root layout
  of its own so the site's layout is never wrapped around Val Studio.
- Strings read through Val carry an invisible edit tag. Use `val.raw()`
  wherever a string must be exact: a URL, a `key`, a comparison, metadata.
- A component with state or event handlers needs `"use client"`; everything
  else in `src/components` is a Server Component.
- Run `npm run validate` after changing content. It type-checks the content
  against the schemas and fixes what it can.

## Architecture

The components follow **TABS** — Typography, Atoms, Base, Sections. See
[src/components/README.md](src/components/README.md). Pages compose Sections and
nothing else.

## The theme

How the site looks is content: `src/theme/theme.val.ts`. An editor picks a
preset (`src/theme/presets.ts`) and overrides single choices — colours, fonts,
button shape, density. `resolveTheme` fills the gaps from the preset and
`themeCss` turns the result into CSS variables, which `src/app/(main)/layout.tsx` renders.

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
