# {{projectName}}

A [Val Build](https://val.build) site on [Next.js](https://nextjs.org) (App
Router), bootstrapped with `npm create @valbuild` (or `pnpm create @valbuild`).

This is the **minimal** template: Val wired into Next.js and one plain
black-and-white page, nothing else. No design system, no components, no theme.
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

## Starting from nothing

The example page is the only thing here that Val does not need. Remove it and
what is left is the smallest Next.js project that runs Val:

1. Delete `src/app/(main)/page.tsx` and `src/content/home.val.ts`.
2. Remove the `home.val` line from `val.modules.ts`.

`/` is then a 404 until you add a page of your own, and `/val` keeps working.

## File structure

| Path                                                  | What it is                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------- |
| `val.config.ts`                                       | Your Val instance: `s`, `c`, `val`, `nextAppRouter`                 |
| `val.modules.ts`                                      | **Every module must be registered here**                            |
| `src/val/val.rsc.ts`                                  | `fetchVal` / `fetchValRoute`: reading content in a Server Component |
| `src/val/val.client.ts`                               | `useVal` / `useValRoute`: reading content in a Client Component     |
| `src/val/val.server.ts`                               | The Val API, served by `src/app/(val)/api/val`                      |
| `src/app/(main)/layout.tsx`                           | The site's root layout: `ValProvider`, around every page            |
| `src/app/(val)/`                                      | Val Studio at `/val`, and the Val API, with a layout of their own   |
| `src/app/ValModulesClient.tsx`                        | Hands your schemas to the Studio, on the client                     |
| `src/app/(main)/page.tsx` + `src/content/home.val.ts` | The example page                                                    |

Put every page of your site in the `(main)` group (or another group with a
layout of its own). The `(val)` group has its own root layout so that the
site's layout, and the Val overlay in it, is never wrapped around the editor.

## Adding pages

For one page, a plain module is enough, as `src/content/home.val.ts` shows.

For many pages of one kind, use a **router module** next to the page: its keys
are the URLs that page serves.

```ts
// src/app/(main)/posts/[slug]/page.val.ts
export default c.define(
  "/src/app/(main)/posts/[slug]/page.val.ts",
  s.router(nextAppRouter, s.object({ title: s.string() })),
  { "/posts/hello-world": { title: "Hello world" } },
);
```

```tsx
// src/app/(main)/posts/[slug]/page.tsx
const post = await fetchValRoute(postsVal, params);
```

Val validates every key against the route's pattern, and Val Studio lists
router modules under **Pages**, where an editor can add a page.

## Val Studio

Val Studio is at [http://localhost:3000/val](http://localhost:3000/val). To
edit on the page itself, turn Val on for your browser at
[http://localhost:3000/api/val/enable?redirect_to=/](http://localhost:3000/api/val/enable?redirect_to=/);
the overlay then appears on every page, and anything read through `fetchVal`
or `useVal` is click-to-editable.

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
