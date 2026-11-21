<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in this project

A [Val Build](https://val.build) site on Next.js (App Router), started from the
full template. Content lives in `*.val.ts` files in this repository and is
edited either here or in Val Studio at `/val`.

<!-- val:codemap:start -->

## Code map

Where things are in this project as it was created from its template. If a file named here has moved, the files are right: correct the line in the same change.

**Pages** — URL, route file, the content it reads, what it renders:

- `/` — `src/app/(main)/page.tsx` · reads `src/app/(main)/page.val.ts` (`anySection` from `src/components/sections/anySection.val.ts`) · renders `src/components/sections/AnySection.tsx`
- `/products/[sku]` — `src/app/(main)/products/[sku]/page.tsx` · reads `src/app/(main)/products/[sku]/page.val.ts` (`imageTextSection` from `src/components/sections/imageTextSection.val.ts`) · renders `src/components/sections/AnySection.tsx`
- `/styleguide` — `src/app/(main)/styleguide/page.tsx` · renders `src/styleguide/Styleguide.tsx`

Val Studio's own, leave alone: `src/app/(val)/`, `src/app/ValModulesClient.tsx`.

**Layout**:

- `src/app/(main)/layout.tsx` — around every page: renders `Header`, `Footer`
- `src/components/Footer.tsx` — the footer's text (in its JSX, not content)
- `src/components/Header.tsx` — the site's name and navigation (in its JSX, not content)
- `src/components/NotFound.tsx` — what a missing page shows
- `src/components/ThemeToggle.tsx` — the light/dark switch in the header

**Section types** — `anySection` in `src/components/sections/anySection.val.ts`, rendered by `src/components/sections/AnySection.tsx`. Each `type`, its schema → its component, in `src/components/sections/`:

- `hero` — `heroSection.val.ts` → `HeroSection.tsx`
- `title-text` — `titleTextSection.val.ts` → `TitleTextSection.tsx`
- `image-text` — `imageTextSection.val.ts` → `ImageTextSection.tsx`
- `card-grid` — `cardGridSection.val.ts` → `CardGridSection.tsx`
- `media-carousel` — `mediaCarouselSection.val.ts` → `MediaCarouselSection.tsx`
- `accordion` — `accordionSection.val.ts` → `AccordionSection.tsx`

**Other components** (a name is its `.tsx` file):

- `src/components/typography/`: Caption, Eyebrow, Heading, Prose, Text, TextLink; prose.val.ts
- `src/components/atoms/`: Button, Divider, Icon, Link, LinkButton, Media, Tag; hrefOf.ts, icon.val.ts, link.val.ts, linkButton.val.ts, media.val.ts
- `src/components/base/`: Accordion, Card, Carousel, Cluster, Container, Grid, Section, SectionHeader, Stack; surface.val.ts
- `src/components/sections/`: sectionHeader.val.ts

**Styles**:

- `src/app/globals.css` — the site's stylesheet; imports tailwindcss and `src/theme/theme.css`
- Tailwind tokens: colours (`bg-*`, `text-*`, `border-*`) `bg` `fg` `fg-muted` `border` `subtle` `link` `action` `on-action` `tint` `on-tint` `highlight` `highlight-tint` `on-highlight-tint` `raised`; `font-heading` `font-body`; `rounded-theme` `rounded-theme-lg`; spacing `section` `gap`

**Content modules** (a file with `c.define`) not listed above: `settings.val.ts`, `src/theme/theme.val.ts`. Schemas only, not modules: `src/shared/meta.val.ts`.

**Media libraries**, and the field that picks from each: `src/media/images.val.ts` `s.image(imagesVal)`; `src/media/videos.val.ts` `s.video(videosVal)`; `src/media/files.val.ts` `s.file(filesVal)`; `src/media/icons.val.ts` `s.image(iconsVal)`; `src/media/fonts.val.ts` `s.font(fontsVal)`.

<!-- val:codemap:end -->

## How to make the common changes

Every file to touch, in order. In Val Studio, a change to a `.val.ts` schema, a route or a dependency shows after a build, not in a quick preview. `<name>` is camelCase, `<Name>` PascalCase, `<kind>` kebab-case.

### Add a section type

1. `src/components/sections/<name>Section.val.ts`: copy `titleTextSection.val.ts`. Export `<name>Section = s.object({ type: s.literal("<kind>"), surface: surfaceSchema, ... })` and `type <Name>SectionSchema = t.inferSchema<typeof <name>Section>`. To reuse: `...sectionHeaderFields` (eyebrow, title, intro; `sectionHeader.val.ts`), `proseSchema` (`prose.val.ts`), `linkButtonsSchema(max)` (`linkButton.val.ts`), `mediaSchema` (`media.val.ts`).
2. `src/components/sections/<Name>Section.tsx`: `export function <Name>Section(props: <Name>SectionSchema)`, inside `<Section surface={surface}>`, built from Base, Atoms and Typography. With state or an event handler it starts with `"use client"`.
3. `src/components/sections/anySection.val.ts`: import it, add it to the union (its order is the Studio's "add section" list) and a `val.type === "<kind>"` branch to `sectionListPreview`.
4. `src/components/sections/AnySection.tsx`: import the component, add its `section.type === "<kind>"` branch.
5. To show one: `{ type: "<kind>", ... }` in a page's `sections`. Nothing goes in `val.modules.ts`.

### Add a field to a section, or to any schema

1. The schema file: add the field, `.nullable()` unless every existing entry is given a value.
2. Every entry of it in the content modules (`src/app/(main)/page.val.ts`, `src/app/(main)/products/[sku]/page.val.ts`) and in `src/components/sections/Sections.stories.tsx`: add the key (`null` if nullable). Content must match the schema exactly.
3. The component: read the prop and render it.

### Add a page

1. `src/app/(main)/<name>/page.tsx`: copy `src/app/(main)/page.tsx`.
2. `src/app/(main)/<name>/page.val.ts`: copy `src/app/(main)/page.val.ts`; `c.define`'s first argument becomes `"/src/app/(main)/<name>/page.val.ts"`, the one key `"/<name>"`, and each relative import one `../` deeper.
3. `val.modules.ts`: add `{ def: () => import("./src/app/(main)/<name>/page.val") },`.
4. `src/components/Header.tsx`: a `<Link href="/<name>">` in the `<nav>`, if it belongs in the navigation.

A new route needs a build. For many pages of one kind, copy `src/app/(main)/products/[sku]/page.tsx` and its `page.val.ts`: one route, a page per key, and editors add pages in the Studio.

### Change the header or footer

`src/components/Header.tsx` (the first link is the site's name, the `<nav>` its navigation) and `src/components/Footer.tsx`. Their text is JSX. To let editors change it, move it into a content module (`src/content/<name>.val.ts`, registered in `val.modules.ts`) and read it with `fetchVal` in `src/app/(main)/layout.tsx`, passed down as props.

### Restyle: bigger, tighter, another colour

- Site-wide it is content, not code: a value in `src/theme/theme.val.ts` (`colors.brand`, `typography.scale`, `base.density`, `base.radius`, `atoms.button.shape`…).
- One component: its Tailwind classes, in its file. Heading sizes: `SIZE` in `src/components/typography/Heading.tsx`.
- What a scale step, radius or density is: `SCALE_RATIO`, `RADIUS`, `DENSITY` in `src/theme/themeCss.ts`. Button, link and card rules: `src/theme/theme.css`. Another font: see the top of `src/theme/fonts.ts`.

### Add a theme token

- A colour: `src/theme/surfaces.ts` (in `SurfaceToken`, `DEFAULT`, and `inverse` and `brand` of `SURFACES`; in `TEXT_PAIRS` if text is drawn in it), then `--color-<token>: var(--<token>);` in `@theme inline` in `src/theme/theme.css`, which makes `bg-<token>` and `text-<token>`. Run `pnpm test`.
- A choice for editors, in order: `src/theme/theme.val.ts` (a nullable field in `themeSchema`, `null` in the content), `src/theme/types.ts` (`Theme`), `src/theme/resolveTheme.ts` (`ThemeInput`, and `resolveTheme` as `input ?? preset`), `src/theme/presets.ts` (a value in every preset), `src/theme/themeCss.ts` (a variable in `themeVariables`, or an attribute in `themeAttributes`), then use `var(--<name>)`.

### Add an image, video or file field

1. Schema: `image: s.image(imagesVal).nullable()`, with `import imagesVal from "../../media/images.val"` (the other kinds: Media libraries, above; `mediaSchema` is an image or a video).
2. Content: `null`, or `{ path: "/public/val/images/<file>" }` for a key already in `src/media/images.val.ts`. An editor uploads new files in the Studio.
3. Component: `<Media media={{ type: "image", image }} />` from `src/components/atoms/Media.tsx`.

## Rules that are not obvious

- `val.config.ts` exports `s` (schemas), `c` (`c.define`), `val` (helpers) and `nextAppRouter`.
- **Every content module is registered in `val.modules.ts`**, or the Studio does not know it.
- `export default c.define(...)` is written inline: assigned to a const first, it validates and then fails at publish time. Its first argument is the module's own path from the repository root, starting with `/`.
- A router module sits beside the `page.tsx` it serves, and is keyed by the URLs that page serves.
- Every page goes in the `(main)` group. `(val)` has a root layout of its own, so the site's layout is never wrapped around Val Studio.
- Read content in a Server Component with `fetchVal` / `fetchValRoute` from `src/val/val.rsc.ts`, in a Client Component with `useVal` / `useValRoute` from `src/val/val.client.ts`. Both give visitors the published content and an editor the draft, click-to-editable.
- Strings read through Val carry an invisible edit tag: use `val.raw()` wherever one must be exact (a URL, a `key`, a comparison, metadata).
- `settings.val.ts` (`s.settings()`) is filled in by editors in the Studio. Keep its content a plain object literal.
- Media is picked from the libraries (`src/media/README.md`): a field stores only `{ path }`, and the size, type and default alt text are the library's.
- A component with state or event handlers needs `"use client"`; everything
  else in `src/components` is a Server Component.
- Working locally, run `npm run validate` after changing content: it checks the content against the schemas and fixes what it can.

## Architecture and theme

**TABS**: Typography, Atoms, Base, Sections (`src/components/README.md`). **Pages compose Sections and nothing else**; a section composes the three layers under it.

How the site looks is content: an editor picks a preset in `src/theme/theme.val.ts` and overrides single choices. `resolveTheme` and `themeCss` turn that into CSS variables, which `src/app/(main)/layout.tsx` renders.

- **Components read tokens, never colours**: a literal colour is wrong in dark mode or on a brand section.
- **Backgrounds are surfaces.** A section sets `data-surface` (`default`, `muted`, `brand`, `inverse`) and everything inside follows. `pnpm test` checks every text colour on every surface against WCAG AA: run it after changing a surface or a ramp.
- **Components never import the framework**: router links and Val's renderers come from `src/framework.tsx`.
- `/styleguide` and `pnpm storybook` show every component under the theme.

<!-- val:mcp:start -->

## Content tools (MCP)

Val's content tools are served over MCP at `/api/mcp` (`src/app/api/mcp/route.ts`,
`src/val/mcp.ts`). In local development an agent can read, validate and edit
content there; a production build refuses unless the project is connected to
Val Build and OAuth is configured — see README.md.

<!-- val:mcp:end -->
