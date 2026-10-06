# Val templates

Every starter that `npm create @valbuild` can make, in one repository, so they
can share code.

```
nextjs/starter/      the Next.js starter (was valbuild/template-nextjs-starter)
tanstack/starter/    the TanStack Start starter (was valbuild/template-tanstack-starter)
tanstack/full/       the Full template: a themeable design system + sections
shared/              code that more than one template is made of
templates.json       which parts of shared/ each template uses
scripts/sync.mjs     copies shared/ into the templates
```

Planned next to `tanstack/full`: `minimal` (one example section), `blog` (one
front page + blog posts) and `docs`, then the same set for Next.js.

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

Shared code is the same file in every framework. Everything a component needs
from the framework comes through one per-template file, `src/framework.tsx`:
`RouterLink`, `ValImage`, `ValRichText`, `ValVideo` and Val's types. A shared
component imports those from there and never from `@tanstack/*`, `next/*` or
`@valbuild/tanstack` / `@valbuild/next` directly. That file, the routes, the
layout, the header and footer, the config files and `package.json` are the
template's own.

## Adding a template

1. Make the folder a complete project (copying the closest template is
   fastest), with its own `src/framework.tsx`.
2. List the shared paths it uses in `templates.json` and run
   `node scripts/sync.mjs`.
3. Add a job for it to the CI workflow (`ci/check.yml` until it is moved to
   `.github/workflows/`).
4. Point `npm create @valbuild` at it: `TEMPLATES` in
   `valbuild/val`'s `packages/create/src/framework.ts`.
