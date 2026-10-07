# {{projectName}}

A [Val Build](https://val.build) site on [TanStack Start](https://tanstack.com/start),
bootstrapped with `npm create @valbuild` (or `pnpm create @valbuild`).

This is the **blog** template: a front page, a blog at `/blog` with one page
per post, authors, and an RSS feed at `/rss.xml` — on the same theme, sections
and components as the Full template.

Content lives in `*.val.ts` files in this repository — type-checked,
refactorable, reviewable in a pull request — and non-developers edit it in Val
Studio at `/val`, where a new post is **New page** under `/blog`.

Everything about how it looks is content too: pick one of four presets in
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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result, and [http://localhost:3000/styleguide](http://localhost:3000/styleguide)
for every component in the current theme. `pnpm storybook` shows the same
components one by one, with every preset and light/dark in its toolbar. Start editing at `src/routes/_site.index.val.ts` — the page updates as
you save.

## Val Studio

Val Studio is at [http://localhost:3000/val](http://localhost:3000/val).

To edit on the page itself, turn Val on for your browser:

```
http://localhost:3000/api/val/enable?redirect_to=/
```

The overlay then appears on every page, and anything read through the hooks in
`src/val/val.hooks.ts` is click-to-editable.

## File structure

| Path                         | What it is                                                    |
| ---------------------------- | ------------------------------------------------------------- |
| `val.config.ts`              | Your Val instance: `s`, `c`, `val`, `tanstackRouter`          |
| `val.modules.ts`             | **Every module must be registered here**                      |
| `src/val/val.hooks.ts`       | `useVal` / `useValRoute` — how components read content        |
| `src/val/val.server.ts`      | The Val API, and content reads that must happen on the server |
| `src/routes/_site.tsx`       | The site's layout: header, footer, `ValProvider`              |
| `src/routes/_site.*.val.ts`  | A page's content                                              |
| `src/routes/val/`            | Val Studio                                                    |
| `src/routes/api/val.$.ts`    | The Val API endpoint                                          |
| `src/components/`            | TABS components — see `src/components/README.md`              |
| `src/components/blog/`       | The post schema, cards, byline, body and Latest Posts         |
| `src/content/authors.val.ts` | The authors a post can name                                   |
| `src/routes/rss[.]xml.ts`    | The RSS feed                                                  |

Put every page of your site under the `_site` layout (or another layout you
add). `__root.tsx` is the document shell for **every** route, Val Studio
included, so anything site-specific in it would be wrapped around the editor.

## Pages and routes

A Val module that holds a page's content is named after the route file it sits
beside — the `.tsx` becomes `.val.ts` — and its keys are the URLs that route
serves:

| Route file                        | Content module                       | Keys                |
| --------------------------------- | ------------------------------------ | ------------------- |
| `src/routes/_site.index.tsx`      | `src/routes/_site.index.val.ts`      | `/`                 |
| `src/routes/_site.blog.index.tsx` | `src/routes/_site.blog.index.val.ts` | `/blog`             |
| `src/routes/_site.blog.$slug.tsx` | `src/routes/_site.blog.$slug.val.ts` | `/blog/hello-world` |

`.` and `/` both separate segments, `$param` is a parameter, `$` on its own is
a splat, and `index`, `route`, `(groups)` and `_pathless` layouts add no URL
segment — exactly TanStack Router's own rules. Val validates every key against
the route's pattern, and Val Studio lists these modules as a sitemap under
**Pages**, where an editor can add a page.

`*.val.ts` files under `src/routes` are excluded from the route generator by
`routeFileIgnorePattern`, set in both `vite.config.ts` and `tsr.config.json`.
Without it the generator reads `blog.$slug.val.ts` as a route.

## Reading content

**Use the hooks** for anything an editor should be able to click:

```tsx
const page = useValRoute(pageVal, Route.useParams());
```

They resolve the published content when the server renders the page, and
whatever the editor currently holds in a browser with the Studio open.

**Read on the server** only when the content has to exist before the component
does — `head` metadata, a redirect, a `notFound()` that must happen during the
request. It has to go through `createServerFn`: a route `loader` runs in the
browser too, so importing `src/val/val.server.ts` into one puts
`@valbuild/server` (and Node's `fs`) in the client bundle.
`src/routes/_site.blog.$slug.tsx` shows both halves.

## The blog

A post is an entry in `src/routes/_site.blog.$slug.val.ts`, keyed by its URL:
a title, a description (shown on every card, and to search engines), a date,
an author, a cover and a body. The schema is in
`src/components/blog/post.val.ts`.

- **Posts are listed newest first**, by their date, everywhere: `/blog`, the
  front page's Latest Posts section and the feed. Nothing has to be ordered by
  hand.
- **An author is picked from a list**, `src/content/authors.val.ts`, by key —
  so renaming someone renames them on every post.
- **Images in a post come from the image library**, like every other image on
  the site.
- **Links in a post may go anywhere.** The rest of the site's rich text checks
  every link against the site's own routes; a post's body takes any `https://`
  link too.
- **The feed** at `/rss.xml` reads what the requester would see, so an editor
  in preview gets their drafts in it. It is not marked cacheable for that
  reason.

The front page's sections are every shared section plus **Latest Posts**,
which only this template has: see `src/components/blog/homeSection.val.ts`.

## Architecture

This project follows the **TABS** architecture: **Typography, Atoms, Base, and
Sections**. Pages are built by composing Sections, which use Atoms, Base
components and Typography primitives. Each layer has clear responsibilities and
strict dependency rules. See
[src/components/README.md](src/components/README.md).

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
