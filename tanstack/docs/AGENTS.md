# Working in this project

A [Val Build](https://val.build) site on [TanStack Start](https://tanstack.com/start)
(React). Content lives in `*.val.ts` files in this repository and is edited
either here or in Val Studio at `/val`.

<!-- val:codemap:start -->

## Code map

This project as it was created from its template. Where a file has since moved, the files are right: correct the line in the same change.

**Pages** — URL, route file, the content it reads, what it renders. A bare name is in `src/routes/`:

- `/docs/$` — `_site.docs.$.tsx` · reads `_site.docs.$.val.ts` (`docPageSchema` from `src/components/docs/doc.val.ts`; `docsLinkProblems` from `src/components/docs/docsOrder.val.ts`) · renders `src/components/docs/DocBlocks.tsx`, `src/components/docs/DocsPager.tsx`
- `/docs` — `_site.docs.index.tsx` · reads `_site.docs.index.val.ts`
- `/` — `_site.index.tsx` · reads `_site.index.val.ts` (`anySection` from `src/components/sections/anySection.val.ts`) · renders `src/components/sections/AnySection.tsx`
- `/styleguide` — `_site.styleguide.tsx` · renders `src/styleguide/Styleguide.tsx`

Val Studio's own, leave alone: `src/routes/__root.tsx`, `src/routes/api/val.$.ts`, `src/routes/val/`. `src/routeTree.gen.ts` is written by the build: never edit it.

**Layout**:

- `src/routes/_site.docs.tsx` — around every page under `/docs`: renders `Container`, `DocsSidebar`
- `src/routes/_site.tsx` — around every page: renders `Footer`, `Header`
- `src/components/Footer.tsx` — the footer's text
- `src/components/Header.tsx` — the site's name and navigation

**Section types** — `anySection` in `src/components/sections/anySection.val.ts`, rendered by `src/components/sections/AnySection.tsx`. Each `type`, its schema → its component, in `src/components/sections/`:

- `hero` — `heroSection.val.ts` → `HeroSection.tsx`
- `title-text` — `titleTextSection.val.ts` → `TitleTextSection.tsx`
- `image-text` — `imageTextSection.val.ts` → `ImageTextSection.tsx`
- `card-grid` — `cardGridSection.val.ts` → `CardGridSection.tsx`
- `media-carousel` — `mediaCarouselSection.val.ts` → `MediaCarouselSection.tsx`
- `accordion` — `accordionSection.val.ts` → `AccordionSection.tsx`

**Block types** — `docBlock` in `src/components/docs/doc.val.ts`: `text`, `code`, `callout`, each written in the union, rendered by `src/components/docs/DocBlocks.tsx`.

**Styles**:

- `src/styles.css` — the site's stylesheet; imports tailwindcss and `src/theme/theme.css`
- Tailwind tokens: colours (`bg-*`, `text-*`, `border-*`) `bg` `fg` `fg-muted` `border` `subtle` `link` `action` `on-action` `tint` `on-tint` `highlight` `highlight-tint` `on-highlight-tint` `raised`; `font-heading` `font-body`; `rounded-theme` `rounded-theme-lg`; spacing `section` `gap`

**Content modules** (a file with `c.define`) not listed above: `settings.val.ts`, `src/theme/theme.val.ts`. Schemas only, not modules: `src/shared/meta.val.ts`.

**Media libraries** in `src/media/`, and the field that picks from each: `images.val.ts` `s.image(imagesVal)`; `videos.val.ts` `s.video(videosVal)`; `files.val.ts` `s.file(filesVal)`; `icons.val.ts` `s.image(iconsVal)`; `fonts.val.ts` `s.font(fontsVal)`.

<!-- val:codemap:end -->

## How to make the common changes

In Val Studio, a change to a `.val.ts` schema, a route or a dependency shows after a build, not in a quick preview. `<name>` is camelCase, `<Name>` PascalCase, `<kind>` kebab-case.

### Add a docs block type

1. `src/components/docs/doc.val.ts`: add `s.object({ type: s.literal("<kind>"), ... })` to `docBlock`, and a branch for it to the `.preview` on `blocks` in `docPageSchema`.
2. `src/components/docs/<Name>.tsx`: the component, as `src/components/docs/Callout.tsx` is.
3. `src/components/docs/DocBlocks.tsx`: import it and add its `block.type === "<kind>"` branch.

The sidebar is `src/components/docs/DocsSidebar.tsx`.

### Add a section type

1. `src/components/sections/<name>Section.val.ts`: copy `titleTextSection.val.ts`. Export `<name>Section = s.object({ type: s.literal("<kind>"), surface: surfaceSchema, ... })` and `type <Name>SectionSchema = t.inferSchema<typeof <name>Section>`. To reuse: `...sectionHeaderFields` (eyebrow, title, intro; `sectionHeader.val.ts` beside it), `proseSchema` (`src/components/typography/prose.val.ts`), `linkButtonsSchema(max)` (`src/components/atoms/linkButton.val.ts`), `mediaSchema` (`src/components/atoms/media.val.ts`).
2. `src/components/sections/<Name>Section.tsx`: `export function <Name>Section(props: <Name>SectionSchema)`, inside `<Section surface={surface}>`, built from `src/components/base/`, `atoms/` and `typography/`.
3. `src/components/sections/anySection.val.ts`: import it, add it to the union and a `val.type === "<kind>"` branch to `sectionListPreview`.
4. `src/components/sections/AnySection.tsx`: import the component, add its `section.type === "<kind>"` branch.
5. To show one: `{ type: "<kind>", ... }` in `sections` in `src/routes/_site.index.val.ts`. Nothing goes in `val.modules.ts`.

### Add a field to a section, or to any schema

1. The schema file: add the field, `.nullable()` unless every existing entry is given a value.
2. Every entry of it in the content (sections: `src/routes/_site.index.val.ts`; docs pages: `src/routes/_site.docs.$.val.ts`): add the key (`null` if nullable). A section's fields are also props where `src/components/sections/Sections.stories.tsx` renders it.
3. The component: read the prop and render it.

### Add a page

1. `src/routes/_site.<name>.tsx`: copy `src/routes/_site.index.tsx`; the route id becomes `createFileRoute("/_site/<name>")` and the import `./_site.<name>.val`.
2. `src/routes/_site.<name>.val.ts`: copy `src/routes/_site.index.val.ts`; `c.define`'s first argument becomes `"/src/routes/_site.<name>.val.ts"` and the one key `"/<name>"`.
3. `val.modules.ts`: add `{ def: () => import("./src/routes/_site.<name>.val") },`.
4. `src/components/Header.tsx`: a `<Link to="/<name>">` in the `<nav>`, if it belongs in the navigation.

A new route needs a build; the build rewrites `src/routeTree.gen.ts` (locally, `npm run dev` does). A docs page is not a route: see The docs.

### Change the header or footer

`src/components/Header.tsx` (the first link is the site's name, then the `<nav>`) and `src/components/Footer.tsx`. To let editors change their text, move it into a content module (`src/content/<name>.val.ts`, registered in `val.modules.ts`) and read it with `useVal`.

### Restyle: bigger, tighter, another colour

- Site-wide it is content, not code: a value in `src/theme/theme.val.ts` (`colors.brand`, `typography.scale`, `base.density`, `base.radius`, `atoms.button.shape`…).
- One component: its Tailwind classes, in its file. Heading sizes: `SIZE` in `src/components/typography/Heading.tsx`.
- `SCALE_RATIO`, `RADIUS`, `DENSITY` in `src/theme/themeCss.ts` are what a scale step, radius or density is. Button, link and card rules: `src/theme/theme.css`. Another font: the top of `src/theme/fonts.ts` says how.

### Add a theme token

- A colour: `src/theme/surfaces.ts` (in `SurfaceToken`, `DEFAULT`, and `inverse` and `brand` of `SURFACES`; in `TEXT_PAIRS` if text is drawn in it), then `--color-<token>: var(--<token>);` in `@theme inline` in `src/theme/theme.css`, which makes `bg-<token>` and `text-<token>`. Run `pnpm test`.
- A choice for editors, in order: `src/theme/theme.val.ts` (nullable in `themeSchema`, `null` in the content), `src/theme/types.ts` (`Theme`), `src/theme/resolveTheme.ts` (`ThemeInput`; `resolveTheme` as `input ?? preset`), `src/theme/presets.ts` (every preset), `src/theme/themeCss.ts` (`themeVariables`, or `themeAttributes`), then use `var(--<name>)`.

### Add an image, video or file field

1. Schema: `image: s.image(imagesVal).nullable()`, with `import imagesVal from "../../media/images.val"` (the other kinds: Media libraries, above; `mediaSchema` is an image or a video).
2. Content: `null`, or `{ path: "/public/val/images/<file>" }` for a key already in `src/media/images.val.ts`: a field stores only the path, the rest is the library's (`src/media/README.md`). An editor uploads new files in the Studio.
3. Component: `<Media media={{ type: "image", image }} />` from `src/components/atoms/Media.tsx`.

## Rules that are not obvious

- **Every content module is registered in `val.modules.ts`**, or the Studio does not know it.
- `export default c.define(...)` is written inline: assigned to a const first, it validates and then fails at publish time. Its first argument is the module's own path from the repository root, starting with `/`.
- A route's content is named after its route file (`.tsx` becomes `.val.ts`) and keyed by the URLs it serves. `.` and `/` separate segments, `$param` is a parameter, `$` a splat; `index`, `route`, `(groups)` and `_pathless` layouts add no segment.
- Leave `routeFileIgnorePattern` in `vite.config.ts` and `tsr.config.json`: it keeps `*.val.ts` out of the routes.
- Every page goes under the `_site` layout. `__root.tsx` is the shell for `/val` too: nothing site-specific goes in it.
- Read content with `useVal` / `useValRoute` from `src/val/val.hooks.ts`: on the server and in the browser, click-to-editable. Read on the server (`src/val/val.server.ts`) only what must exist before the component does (`head`, a redirect, `notFound()`), and only **through `createServerFn`**: a `loader` runs in the browser too, and `val.server` would put Node's `fs` in the client bundle. `src/routes/_site.docs.$.tsx` shows how.
- Strings read through Val carry an invisible edit tag: use `val.raw()` wherever one must be exact (a URL, a `key`, a comparison, `<title>`). Locally, the browser console warns when a tag leaves React (`.env.development`): fix it with `val.raw()`.
- `settings.val.ts` (`s.settings()`) is filled in by editors in the Studio. Keep its content a plain object literal.
- Working locally, run `npm run validate` after changing content: it checks the content against the schemas and fixes what it can.

## The docs

- Adding a docs page is content only: an entry of `src/routes/_site.docs.$.val.ts`, keyed by its URL (`/docs/...`, any depth), with a `group`, and the page before it pointing at it with `next`.
- The sidebar and Previous / Next are worked out by `docsOrder` in `src/components/docs/docsOrder.val.ts` from each page's `group` and `next`. Do not store Previous, an order number or a nav module: the links are the order.
- `docsLinkProblems` validates the links (self, shared and circular `next`). Keep it and `docsOrder` agreeing, and run `pnpm test` after changing either.
- Read the order with `useDocs()` (`src/components/docs/useDocs.ts`), which works on `val.raw` values.
- Code blocks render `val.raw(code)` with `val.attrs`, so a copied snippet has no edit tags in it. Keep it that way.

## Architecture and theme

**TABS**: Typography, Atoms, Base, Sections (`src/components/README.md`). **Pages compose Sections and nothing else**; a section composes the three layers under it.

How the site looks is content: an editor picks a preset in `src/theme/theme.val.ts` and overrides single choices, and `src/routes/_site.tsx` renders the result as CSS variables.

- **Components read tokens, never colours**: a literal colour is wrong in dark mode or on a brand section.
- **Backgrounds are surfaces.** A section sets `data-surface` (`default`, `muted`, `brand`, `inverse`) and everything inside follows. `pnpm test` checks their contrast: run it after changing a surface or a ramp.
- **Components never import the framework**: router links and Val's renderers come from `src/framework.tsx`.

<!-- val:mcp:start -->

## Content tools (MCP)

Val's content tools are served over MCP at `/api/mcp` (`src/routes/api/mcp.ts`, `src/val/mcp.server.ts`): open to an agent in local development, refused in production unless the project is connected to Val Build and OAuth is configured. See README.md.

<!-- val:mcp:end -->
