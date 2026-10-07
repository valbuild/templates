# {{projectName}}

A [Val Build](https://val.build) site on [TanStack Start](https://tanstack.com/start),
bootstrapped with `npm create @valbuild` (or `pnpm create @valbuild`).

This is the **minimal** template: Val fully wired into TanStack Start — the
Studio, the API, and content tools for coding agents over MCP — and one plain
black-and-white page. Nothing else: no CSS framework, no design system, no
components, no theme. Bring your own.
Start here when you want to build your own; start from the **Full** template
when you want a site that is ready to edit.

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

Open [http://localhost:3000](http://localhost:3000) to see the page, and
[http://localhost:3000/val](http://localhost:3000/val) for Val Studio. Change
the text in `src/content/home.val.ts`, or in the Studio, and the page follows.

## Val Studio

Val Studio is at [http://localhost:3000/val](http://localhost:3000/val).

To edit on the page itself, turn Val on for your browser:

```
http://localhost:3000/api/val/enable?redirect_to=/
```

The overlay then appears on every page, and anything read through the hooks in
`src/val/val.hooks.ts` is click-to-editable.

## Starting from nothing

The example page is the only thing here that Val does not need. Remove it and
what is left is a clean TanStack Start project with Val fully set up — the
Studio, the API and the MCP endpoint — and nothing else:

1. Delete `src/routes/_site.index.tsx` and `src/content/home.val.ts`.
2. Remove the `home.val` line from `val.modules.ts`.

`/` is then an empty page until you add one of your own, and `/val` keeps
working.

## File structure

| Path                                                     | What it is                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| `val.config.ts`                                          | Your Val instance: `s`, `c`, `val`, `tanstackRouter`          |
| `val.modules.ts`                                         | **Every module must be registered here**                      |
| `src/val/val.hooks.ts`                                   | `useVal` / `useValRoute`: how components read content         |
| `src/val/val.server.ts`                                  | The Val API, and content reads that must happen on the server |
| `src/routes/__root.tsx`                                  | The document shell, for every route including Val Studio      |
| `src/routes/_site.tsx`                                   | The site's layout: `ValProvider`, around every page           |
| `src/routes/val/`                                        | Val Studio, at `/val`                                         |
| `src/routes/api/val.$.ts`                                | The Val API endpoint                                          |
| `src/routes/api/mcp.ts`                                  | Val's content tools for coding agents, over MCP               |
| `src/val/mcp.server.ts`                                  | What the MCP endpoint serves, and who may call it             |
| `src/routes/_site.index.tsx` + `src/content/home.val.ts` | The example page                                              |

Put every page of your site under the `_site` layout. `__root.tsx` is the
document shell for **every** route, Val Studio included, so anything
site-specific in it would be wrapped around the editor.

## Adding pages

For one page, a plain module is enough, as `src/content/home.val.ts` shows.

For many pages of one kind, use a **router module**: it is named after the
route file it sits beside, and its keys are the URLs that route serves.

```ts
// src/routes/_site.posts.$slug.val.ts
export default c.define(
  "/src/routes/_site.posts.$slug.val.ts",
  s.router(tanstackRouter, s.object({ title: s.string() })),
  { "/posts/hello-world": { title: "Hello world" } },
);
```

```tsx
// src/routes/_site.posts.$slug.tsx
const post = useValRoute(postsVal, Route.useParams());
```

`.` and `/` both separate segments, `$param` is a parameter, and `index`,
`route`, `(groups)` and `_pathless` layouts add no URL segment. Val validates
every key against the route's pattern, and Val Studio lists router modules
under **Pages**, where an editor can add a page. `*.val.ts` files under
`src/routes` are excluded from TanStack's route generator by
`routeFileIgnorePattern` in `vite.config.ts` and `tsr.config.json`.

## Reading content

**Use the hooks** (`useVal`, `useValRoute`) for anything an editor should be
able to click. They resolve the published content when the server renders the
page, and whatever the editor currently holds while the Studio is open.

**Read on the server** only when the content has to exist before the component
does: `head` metadata, a redirect, a `notFound()`. It has to go through
`createServerFn`: a route `loader` runs in the browser too, so importing
`src/val/val.server.ts` into one puts Node's `fs` in the client bundle.

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
[`src/val/mcp.images.server.ts`](src/val/mcp.images.server.ts), which says how to turn it off.
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

Type-checks the content against your schemas and fixes what it can (image
dimensions, mime types, and other metadata Val can read off the file).

## Package manager

npm, pnpm, yarn and bun all work — nothing here is tied to one.

`npm create @valbuild` / `pnpm create @valbuild` installs with the package
manager you ran it with and leaves exactly one lock file behind: that package
manager's. If you clone this template directly, install with whichever you
prefer.

## Learn More

- [Val Build docs](https://val.build/docs)
- [`@valbuild/tanstack` README](https://github.com/valbuild/val/blob/main/packages/tanstack/README.md)
- [TanStack Start docs](https://tanstack.com/start/latest/docs/framework/react/overview)
- [The Val Build repository](https://github.com/valbuild/val) — feedback and
  contributions welcome
- [Val Build App](https://app.val.build) — connect this project so your team can
  edit content in production

## Deploy

TanStack Start builds to a Nitro server, so it deploys anywhere Node runs —
[Netlify](https://tanstack.com/start/latest/docs/framework/react/hosting),
[Vercel](https://vercel.com/new), Cloudflare, a container.

After deploying, set the project up on [Val Build App](https://app.val.build) so
everyone can edit content in production.

### On Val's platform

A project created on [Val Build App](https://app.val.build) is hosted by Val,
and `.github/workflows/val-publish.yml` is how it is built: every push to
`main` — Val's own commits included, when an editor presses Publish — runs
`val publish`, which builds the site from the checkout and publishes it. Add
the project token from the project's settings as the `VAL_PROJECT_TOKEN`
repository secret; without it the workflow does nothing. The workflow uses
pnpm, like this repository's lock file. `npm create @valbuild` leaves the
workflow out, since a project it creates is deployed by you.
