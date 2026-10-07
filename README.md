# Val templates

Every template that `npm create @valbuild` can make, in one repository, so they
can share code.

```
tanstack/full/       Full on TanStack Start: a themeable design system + sections
tanstack/minimal/    Minimal on TanStack Start: Val wired in, one black-and-white page
nextjs/full/         Full on Next.js (App Router), with the same components
nextjs/minimal/      Minimal on Next.js
shared/              code that more than one template is made of
templates.json       which parts of shared/ each template uses
scripts/sync.mjs     copies shared/ into the templates
```

Planned: `blog` (one front page + blog posts) and `docs`, on both frameworks.
TanStack Start is the primary one: a feature lands there first.

The two Full templates are the same components, theme, sections and stories —
copied from `shared/` — on different frameworks; what differs is routing,
layouts and `src/framework.tsx`. Both serve Val's content tools over MCP at
`/api/mcp`, which `npm create @valbuild` can leave out: the files are
`src/routes/api/mcp.ts`, `src/routes/[.]well-known.oauth-protected-resource.ts`
and `src/val/mcp*.server.ts` in TanStack, and `src/app/api/mcp/route.ts`,
`src/app/.well-known/oauth-protected-resource/route.ts` and `src/val/mcp*.ts` in
Next.js, with the README section between `<!-- val:mcp:start -->` and
`<!-- val:mcp:end -->`.

The Minimal templates share nothing from `shared/`: each is the smallest
project that runs Val on its framework, plus one example page that its README
explains how to delete.

The old starters (`valbuild/template-tanstack-starter` and
`valbuild/template-nextjs-starter`) were brought in with their history and then
replaced, so `git log` still has them. The Next.js templates were built from
the old Next.js starter's wiring.

## Every template is complete on its own

A template is downloaded with [degit](https://github.com/Rich-Harris/degit),
which copies one folder as it is (`degit valbuild/templates/tanstack/full`).
So a template cannot import from `../shared` — whatever it uses from `shared/`
is copied into it and committed, and the template folder is an ordinary,
runnable project: `cd tanstack/full && pnpm install && pnpm dev`.

`shared/` is the source of truth for those copies. CI fails if a template's
copy differs from it.

## Working on shared code

Either edit `shared/` and copy it out:

```bash
node scripts/sync.mjs            # shared/ -> every template that uses it
```

or work inside a template, where you can run it, and pull the result back:

```bash
cd tanstack/full && pnpm dev     # edit src/components/..., see it live
cd ../.. && node scripts/sync.mjs --pull tanstack/full && node scripts/sync.mjs
```

`node scripts/sync.mjs --check` is what CI runs.

> **CI is not switched on yet.** The workflow is in `ci/check.yml` because
> the session that created this repository could not push to
> `.github/workflows/`. Move it there (`git mv ci/check.yml
> .github/workflows/check.yml`) to turn it on.

### What is shared, and what is not

Shared code is the same file in every template. Everything a component needs
from the framework comes through one per-template file, `src/framework.tsx`:
`RouterLink`, `ValImage`, `ValRichText`, `ValVideo` and Val's types. A shared
component imports those from there and never from `@tanstack/*`, `next/*`,
`@valbuild/tanstack` or `@valbuild/next` directly. That is what lets the Full
templates on two frameworks be the same files.

Shared components are Server Components unless they need state: a shared
component with `useState` or an event handler starts with `"use client"`,
which TanStack Start ignores and Next.js needs. That file, the routes, the
layout, the header and footer, the config files and `package.json` are the
template's own.

So are the media libraries in `src/media/` (`images.val.ts`, `videos.val.ts`,
`files.val.ts`, …). Shared components import them by path — every media field
is `s.image(imagesVal)` and the like — but their entries are the template's
content, so each template keeps its own and the sync leaves them alone. A
template that uses the shared components must have all five.

## Adding a template

1. Make the folder a complete project (copying the closest template is
   fastest), with its own `src/framework.tsx`.
2. List the shared paths it uses in `templates.json` and run
   `node scripts/sync.mjs`.
3. Add a job for it to the CI workflow (`ci/check.yml` until it is moved to
   `.github/workflows/`).
4. Point `npm create @valbuild` at it: `TEMPLATES` in
   `valbuild/val`'s `packages/create/src/framework.ts`.
