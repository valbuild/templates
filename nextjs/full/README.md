# {{projectName}}

A [Val Build](https://val.build) site on [Next.js](https://nextjs.org) (App
Router), bootstrapped with `npm create @valbuild` (or `pnpm create @valbuild`).

This is the **full** template: a home page built from sections (hero, cards,
image and text, carousel, FAQ), an example route with many pages, and a design
system whose look is content too. Pick one of four presets in
`src/theme/theme.val.ts` and override what you like — colours, fonts, button
shape, density — in Val Studio. Every colour is built so that text stays
readable, in light and dark mode, whatever you pick.

## Getting Started

Install the dependencies and run the development server with the package
manager you want to use:

```bash
npm install && npm run dev
# or
pnpm install && pnpm dev
# or
yarn && yarn dev
# or
bun install && bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site,
[http://localhost:3000/styleguide](http://localhost:3000/styleguide) for every
component in the current theme, and [http://localhost:3000/val](http://localhost:3000/val)
for Val Studio. `pnpm storybook` shows the components one by one, with every
preset and light/dark in its toolbar.

## Val Studio

To edit on the page itself, turn Val on for your browser at
[http://localhost:3000/api/val/enable?redirect_to=/](http://localhost:3000/api/val/enable?redirect_to=/);
the overlay then appears on every page, and anything read through `fetchVal`
or `useVal` is click-to-editable.

## File structure

| Path                            | What it is                                                          |
| ------------------------------- | ------------------------------------------------------------------- |
| `val.config.ts`                 | Your Val instance: `s`, `c`, `val`, `nextAppRouter`                 |
| `val.modules.ts`                | **Every module must be registered here**                            |
| `src/val/val.rsc.ts`            | `fetchVal` / `fetchValRoute`: reading content in a Server Component |
| `src/val/val.client.ts`         | `useVal` / `useValRoute`: reading content in a Client Component     |
| `src/val/val.server.ts`         | The Val API, served by `src/app/(val)/api/val`                      |
| `src/app/(main)/layout.tsx`     | The site's root layout: theme, header, footer, `ValProvider`        |
| `src/app/(main)/**/page.val.ts` | A page's content, beside the page it serves                         |
| `src/app/(val)/`                | Val Studio at `/val`, and the Val API                               |
| `src/theme/`                    | The theme: presets, colours, and the CSS they become                |
| `src/media/`                    | The media libraries: every image, video and file on the site        |
| `src/components/`               | TABS components — see `src/components/README.md`                    |
| `src/framework.tsx`             | Everything the components need from Next.js, in one place           |

Put every page of your site in the `(main)` group. The `(val)` group has its
own root layout so that the site's layout, and the Val overlay in it, is never
wrapped around the editor.

## Pages and routes

A page's content sits in a router module beside the page, and its keys are the
URLs that page serves:

| Page                                     | Content module                              | Keys                  |
| ---------------------------------------- | ------------------------------------------- | --------------------- |
| `src/app/(main)/page.tsx`                | `src/app/(main)/page.val.ts`                | `/`                   |
| `src/app/(main)/products/[sku]/page.tsx` | `src/app/(main)/products/[sku]/page.val.ts` | `/products/product-1` |

Val validates every key against the route's pattern, and Val Studio lists
these modules under **Pages**, where an editor can add a page.

## Architecture

The components follow **TABS**: **Typography, Atoms, Base and Sections**.
Pages compose Sections, which use Atoms, Base components and Typography. None
of them pick a colour, a font or a size of their own: they read the theme's
tokens. See [src/components/README.md](src/components/README.md).

<!-- val:mcp:start -->

## Coding agents (MCP)

This project serves Val's content tools over the
[Model Context Protocol](https://modelcontextprotocol.io) at
`/api/mcp`, so a coding agent can read your schemas, look content up, validate
it and edit it — without a browser and without being shown the Studio.

Point a client at it. In local development that is all it needs:

```bash
claude mcp add --transport http val http://localhost:3000/api/mcp
```

### What it can do

`get_all_schema`, `get_source`, `get_record_keys`, `count_entries`,
`validate_content`, `get_patches` and `get_source_path_from_route` read.
`create_patch`, `duplicate_source`, `empty_at_path` and
`remove_image_gallery_entry` write. Every write is validated against your real
schemas first and is rejected outright if it would leave the content invalid, so
an agent cannot break the site by editing it.

`upload_image` adds an image to an `s.imageset()` library or an `s.image()` field,
including remote ones (`.remote()`) — those upload to
Val's content host when you publish, not when the agent adds them, so an agent
needs nothing beyond what your app already has.
It is the one tool with a dependency of its own — `sharp`, for reading an
image's dimensions and re-encoding it — and it lives in
[`src/val/mcp.images.ts`](src/val/mcp.images.ts), which says how to turn it off.
If you created this project with `npm create @valbuild` and declined image
uploads, that file is already the off version and `sharp` is not installed.

### Deploying it

The endpoint refuses to serve on a deployed host in local filesystem mode. That
is not a setting: in that mode there is no credential and no backend, so the
tools read and write the running process's own working tree, and serving that
publicly is an unauthenticated write endpoint for anyone who can reach the port.

To use MCP against a deployed app, connect the project to
[Val Build](https://app.val.build) (proxy mode) and set `VAL_OAUTH_ISSUER` and
`VAL_MCP_RESOURCE`:

```
VAL_OAUTH_ISSUER=https://admin.val.build
VAL_MCP_RESOURCE=https://your-app.com/api/mcp
```

Every call then has to present an access token that Val's authorization server
issued, which this app verifies itself — signature, issuer, audience and expiry
— so the caller's identity is checked rather than claimed, and their edits show
up in the review screen as theirs. Clients discover where to authorize from
`/.well-known/oauth-protected-resource`.

Without that config a deployed app in proxy mode falls back to accepting a
personal access token as a bearer token. **Treat a PAT like a password**: it
grants everything its owner can touch, across every project of every
organization they belong to. Prefer the OAuth setup above, and revoke a token on
any suspicion.

<!-- val:mcp:end -->

## Validating content

```bash
npm run validate
```

Type-checks the content against your schemas and fixes what it can.

## Package manager

npm and pnpm are both supported (as are yarn and bun) — nothing here is tied to
one of them.

`npm create @valbuild` / `pnpm create @valbuild` installs with the package
manager you ran it with, and leaves exactly one lock file behind: the one that
package manager wrote. That lock file is the project's. If you clone this
template directly instead, the committed `pnpm-lock.yaml` is pnpm's; to use a
different package manager, delete it before installing so you do not end up with
two lock files and only one of them real.

## Learn More

To learn more about Val Build, take a look at the [docs here](https://val.build/docs).

You can also check out [the Val Build GitHub repository](https://github.com/valbuild/val) - your feedback and contributions are welcome!

You can also setup you application in [Val Build App](https://app.val.build).

## Deploy

The easiest way to deploy your Val enabled application is is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

After deploying, you can make sure that everyone can edit content in production by setting up your application on [Val Build App](https://app.val.build).
