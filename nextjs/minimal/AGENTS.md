<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in this project

A [Val Build](https://val.build) site on Next.js (App Router), started from the
minimal template: Val is wired in, and there is one example page. Content lives
in `*.val.ts` files in this repository and is edited either here or in Val
Studio at `/val`.

## Where content lives

- `val.config.ts` — the Val instance: `s` (schemas), `c` (`c.define`), `val`
  (helpers), `nextAppRouter`.
- `val.modules.ts` — **every module has to be registered here.** A module that
  is not in this list does not exist as far as the Studio is concerned.
- `src/content/home.val.ts` — the example page's content, a plain module.
- For many pages of one kind, a router module next to the page:
  `src/app/(main)/posts/[slug]/page.val.ts`, keyed by URL
  (`/posts/hello-world`). See "Adding pages" in README.md.

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
- `ValModulesClient` must be rendered both in `(main)/layout.tsx` and on the
  `/val` page, or the Studio loads without your content.
- Strings read through Val carry an invisible edit tag. Use `val.raw()`
  wherever a string must be exact: a URL, a `key`, a comparison, metadata.
- There is no CSS framework: `src/app/globals.css` holds the few global rules,
  and the example page styles itself inline. Add whatever styling you prefer.
- Run `npm run validate` after changing content. It type-checks the content
  against the schemas and fixes what it can.

## Removing the example page

Delete `src/app/(main)/page.tsx` and `src/content/home.val.ts`, and remove the
`home.val` line from `val.modules.ts`. Everything left is Val's own setup.

<!-- val:mcp:start -->

## Content tools (MCP)

Val's content tools are served over MCP at `/api/mcp` (`src/app/api/mcp/route.ts`,
`src/val/mcp.ts`). In local development an agent can read, validate and edit
content there; a production build refuses unless the project is connected to
Val Build and OAuth is configured — see README.md.

<!-- val:mcp:end -->
