# Val templates

Every template that `npm create @valbuild` can make, in one repository, so they
can share code.

```
tanstack/full/       Full on TanStack Start: a themeable design system + sections
tanstack/minimal/    Minimal on TanStack Start: Val wired in, one black-and-white page
tanstack/blog/       Blog on TanStack Start: Full's theme and sections, a blog, authors, RSS
tanstack/docs/       Docs on TanStack Start: nested pages, a sidebar worked out from the pages
nextjs/full/         Full on Next.js (App Router), with the same components
nextjs/minimal/      Minimal on Next.js
shared/              code that more than one template is made of
templates.json       which parts of shared/ each template uses
scripts/sync.mjs     copies shared/ into the templates
catalog.json         what `npm create @valbuild` and admin.val.build/new offer
mirrors.json         the template repositories /new seeds from and copies, see below
scripts/mirror.sh    stages them on `next`, then has valbuild/home reseed
scripts/promote.sh   moves a mirror's `main` once its seed is built
scripts/app-config.mjs  turns on remote media in each mirror's val.config.ts
catalog/             the icons and screenshots the catalog points at
scripts/catalog.mjs  checks catalog.json against the templates
```

Planned: `blog` and `docs` on Next.js.
TanStack Start is the primary one: a feature lands there first.

The Full, Blog and Docs templates are the same components, theme, sections and stories —
copied from `shared/` — on different frameworks; what differs is routing,
layouts and `src/framework.tsx`.

The Minimal templates share nothing from `shared/`. Each has Val fully set up
on its framework — the Studio, the API and MCP — and one example page that its
README explains how to delete, and nothing a developer would have to undo: no
CSS framework, no components, no theme.

Every template serves Val's content tools over MCP at `/api/mcp`, which
`npm create @valbuild` can leave out. Which files, dependencies and doc sections
that removes is listed per template in `catalog.json` (below).

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
.github/workflows/check.yml`) to turn it on.

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

## The catalog

`catalog.json` is the list of templates that can be created, read at run time
by `npm create @valbuild` and by admin.val.build/new. This repository decides
what is offered, in what order, with what name, icon and screenshots — a
template is added, renamed or retired here, without a release of the CLI.

Each entry also says what its optional features are MADE of, because only the
template knows: `features.mcp` lists the files and directories, the
dependencies and the docs (`README.md`, `AGENTS.md`, each with one
`<!-- val:mcp:start -->` … `<!-- val:mcp:end -->` region) that go when MCP is
declined, and `features.imageUploads` the file that is replaced and the
dependency that goes when image uploads are. `regenerate` names a script that
brings generated files up to date afterwards — TanStack's `routeTree.gen.ts`
imports every route, including the MCP ones.

`node scripts/catalog.mjs --check` checks every one of those claims, and CI runs
it: each path exists and stays inside its template, each dependency is
declared, each doc has its markers, and nothing left after a feature is removed
still imports a removed file or package.

The CLI reads the catalog from the same ref it downloads the template from. To
try a branch through `npm create` itself before it lands:

```sh
VAL_TEMPLATES_REF=my-branch npm create @valbuild@latest
```

Screenshots are 1440×900, of the home page with nothing edited, in light and
dark, from a production build.

## The mirrors, and what admin.val.build/new seeds from

admin.val.build/new makes two things from a template: a site, copied from a
SEED the platform builds, and, when someone asks for it, their own GitHub
repository with the code. GitHub can only make a repository from a WHOLE
template repository, never from one folder of this one, so each template /new
offers is also published as its own repository, a mirror:

| Folder             | Mirror                               |
| ------------------ | ------------------------------------ |
| `tanstack/full`    | `valbuild/template-tanstack-full`    |
| `tanstack/blog`    | `valbuild/template-tanstack-blog`    |
| `tanstack/docs`    | `valbuild/template-tanstack-docs`    |
| `tanstack/minimal` | `valbuild/template-tanstack-minimal` |

`mirrors.json` is that table.

The site and the repository have to be the same commit, and the two are made
in different ways: the site is copied from a seed valbuild/home builds, and the
repository by GitHub's `/generate`, which copies a mirror's `main` at whatever
commit it is at and cannot be given another. So a mirror's `main` moves only
once its seed has been built from the commit it moves to:

1. On every push to `main` that touches `tanstack/`,
   `.github/workflows/mirror.yml` runs `scripts/mirror.sh`. It makes each
   mirror's **`next`** the folder exactly as committed here, in one commit
   that names the commit it came from. Files gone from the folder go from the
   mirror. With one change: `val.config.ts` gets `files: { remote: true }`
   (see below). It never touches `main`, and `/generate` never copies `next`.
2. Only once every mirror has been pushed, it starts `reseed-templates.yml` in
   valbuild/home, naming each mirror's `next` commit. A mirror that failed to
   push fails the run and nothing is reseeded.
3. valbuild/home builds each seed from exactly the commit named, one template
   at a time. Only after a template's seed is published does it start
   `promote-mirror.yml` here, which runs `scripts/promote.sh` and moves that
   mirror's `main` to the commit. It refuses anything but a fast-forward to a
   commit on `next`.

So a template whose seed fails to build holds back only itself, and its site
and its repository both stay at the previous commit; `next` carries the
commit until a later run builds it or something newer. Re-running home's
failed reseed picks up where it stopped: it skips the seeds it already built
and asks again for any `main` still behind its seed.

A mirror's `main` is behind its `next` for as long as a reseed takes. That is
the point, not a fault.

**Never change a mirror directly.** The next push here overwrites it.

### Media is remote in a mirror, and local here

A project made on /new runs in the Val app, which keeps every image, file and
video on Val's remote content host and refuses to start without
`files: { remote: true }` in `initVal` — there is no repository there for an
upload to go into. A project made with `npm create @valbuild` keeps its media
in its own repository, and with that setting every image in the template would
fail validation until uploaded, which needs a Val project it may not have yet.

So the templates here leave it out, and `scripts/app-config.mjs` adds it to
each mirror's `val.config.ts` as it is published. It edits text, so it refuses
a config it cannot read plainly — more than one `initVal({`, or a `files` key
already there — and `mirror.sh` runs `node scripts/app-config.mjs --check`
before pushing anything, so a template that stops matching fails the run rather
than leaving the mirrors at different commits. Run the same check after
changing a mirrored template's `val.config.ts`.

The template's own images are local paths in a mirror. The Studio does not
block on that (`image:upload-remote` is repaired, not shown), and
`npx val validate --fix` uploads them.

The workflows need two repository secrets. Without either one they fail
loudly, because a seed that quietly stops following this repository is the bug
they exist to catch:

- `VAL_TEMPLATE_MIRROR_TOKEN`: a fine-grained token for the mirrors only, with
  **Contents** and **Workflows** read and write. Workflows is needed because
  each mirror carries the template's `.github/workflows`. Both `mirror.yml`
  and `promote-mirror.yml` use it.
- `VAL_HOME_DISPATCH_TOKEN`: a fine-grained token for `valbuild/home` only,
  with **Actions** read and write.

valbuild/home holds the reverse: `VAL_TEMPLATES_DISPATCH_TOKEN`, for this
repository only, with **Actions** read and write, so it can start
`promote-mirror.yml` and nothing else. It cannot write to a mirror.

To publish the mirrors again by hand, use Actions → _Mirror templates and
reseed_ → **Run workflow**. It always publishes `main`. To move one mirror's
`main` by hand, use _Promote a mirror_ with a commit already on its `next` --
but only to a commit whose seed is built, or the site and the repository part
ways.

## Adding a template

1. Make the folder a complete project (copying the closest template is
   fastest), with its own `src/framework.tsx`.
2. List the shared paths it uses in `templates.json` and run
   `node scripts/sync.mjs`.
3. Add a job for it to the CI workflow (`ci/check.yml` until it is moved to
   `.github/workflows/`).
4. Add it to `catalog.json`, with an icon and screenshots in `catalog/`, and
   run `node scripts/catalog.mjs --check`. That is all `npm create @valbuild`
   needs to offer it.
5. For admin.val.build/new to offer it too: create an empty mirror repository,
   tick **Settings → General → Template repository** on it, give
   `VAL_TEMPLATE_MIRROR_TOKEN` access to it, add it to `mirrors.json`, and add
   it to `platform/templates.json` in valbuild/home. The mirror gets a `next`
   on the next push here, and its `main` once its first seed is built.
