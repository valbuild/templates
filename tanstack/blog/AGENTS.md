# Working in this project

A [Val Build](https://val.build) site on [TanStack Start](https://tanstack.com/start)
(React). Content lives in `*.val.ts` files in this repository and is edited
either here or in Val Studio at `/val`.

<!-- val:codemap:start -->

## Code map

Where things are in this project as it was created from its template. If a file named here has moved, the files are right: correct the line in the same change.

**Pages** — URL, route file, the content it reads, what it renders:

- `/blog/$slug` — `src/routes/_site.blog.$slug.tsx` · reads `src/content/authors.val.ts`, `src/routes/_site.blog.$slug.val.ts` (`postSchema` from `src/components/blog/post.val.ts`) · renders `src/components/blog/Byline.tsx`, `src/components/blog/PostBody.tsx`
- `/blog` — `src/routes/_site.blog.index.tsx` · reads `src/routes/_site.blog.index.val.ts`, `src/routes/_site.blog.$slug.val.ts` · renders `src/components/blog/PostCard.tsx`
- `/` — `src/routes/_site.index.tsx` · reads `src/routes/_site.index.val.ts` (`homeSection` from `src/components/blog/homeSection.val.ts`) · renders `src/components/blog/HomeSection.tsx`
- `/styleguide` — `src/routes/_site.styleguide.tsx` · renders `src/styleguide/Styleguide.tsx`
- `/rss.xml` — `src/routes/rss[.]xml.ts` · reads `src/content/authors.val.ts`, `src/routes/_site.blog.index.val.ts`, `src/routes/_site.blog.$slug.val.ts`

Val Studio's own, leave alone: `src/routes/__root.tsx`, `src/routes/api/val.$.ts`, `src/routes/val/`. `src/routeTree.gen.ts` is written by the build: never edit it.

**Layout**:

- `src/routes/_site.tsx` — around every page: renders `Footer`, `Header`
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

**Section types** — `homeSection` in `src/components/blog/homeSection.val.ts`, rendered by `src/components/blog/HomeSection.tsx`. Each `type`, its schema → its component, in `src/components/blog/`:

- `latest-posts` — `latestPostsSection.val.ts` → `LatestPostsSection.tsx`
- and, listed above: `hero`, `title-text`, `image-text`, `card-grid`, `media-carousel`, `accordion`

**Other components** (a name is its `.tsx` file):

- `src/components/typography/`: Caption, Eyebrow, Heading, Prose, Text, TextLink; prose.val.ts
- `src/components/atoms/`: Button, Divider, Icon, Link, LinkButton, Media, Tag; hrefOf.ts, icon.val.ts, link.val.ts, linkButton.val.ts, media.val.ts
- `src/components/base/`: Accordion, Card, Carousel, Cluster, Container, Grid, Section, SectionHeader, Stack; surface.val.ts
- `src/components/sections/`: sectionHeader.val.ts
- `src/components/blog/`: Byline, PostBody, PostCard; post.val.ts, posts.ts

**Styles**:

- `src/styles.css` — the site's stylesheet; imports tailwindcss and `src/theme/theme.css`
- Tailwind tokens: colours (`bg-*`, `text-*`, `border-*`) `bg` `fg` `fg-muted` `border` `subtle` `link` `action` `on-action` `tint` `on-tint` `highlight` `highlight-tint` `on-highlight-tint` `raised`; `font-heading` `font-body`; `rounded-theme` `rounded-theme-lg`; spacing `section` `gap`

**Content modules** (a file with `c.define`) not listed above: `settings.val.ts`, `src/theme/theme.val.ts`. Schemas only, not modules: `src/shared/meta.val.ts`.

**Media libraries**, and the field that picks from each: `src/media/images.val.ts` `s.image(imagesVal)`; `src/media/videos.val.ts` `s.video(videosVal)`; `src/media/files.val.ts` `s.file(filesVal)`; `src/media/icons.val.ts` `s.image(iconsVal)`; `src/media/fonts.val.ts` `s.font(fontsVal)`.

<!-- val:codemap:end -->

## How to make the common changes

Every file to touch, in order. In Val Studio, a change to a `.val.ts` schema, a route or a dependency shows after a build, not in a quick preview. `<name>` is camelCase, `<Name>` PascalCase, `<kind>` kebab-case.

### Add a section type

1. `src/components/sections/<name>Section.val.ts`: copy `titleTextSection.val.ts`. Export `<name>Section = s.object({ type: s.literal("<kind>"), surface: surfaceSchema, ... })` and `type <Name>SectionSchema = t.inferSchema<typeof <name>Section>`. To reuse: `...sectionHeaderFields` (eyebrow, title, intro; `sectionHeader.val.ts`), `proseSchema` (`prose.val.ts`), `linkButtonsSchema(max)` (`linkButton.val.ts`), `mediaSchema` (`media.val.ts`).
2. `src/components/sections/<Name>Section.tsx`: `export function <Name>Section(props: <Name>SectionSchema)`, inside `<Section surface={surface}>`, built from Base, Atoms and Typography.
3. `src/components/sections/anySection.val.ts`: import it, add it to the union (its order is the Studio's "add section" list) and a `val.type === "<kind>"` branch to `sectionListPreview`.
4. `src/components/sections/AnySection.tsx`: import the component, add its `section.type === "<kind>"` branch.
5. `src/components/blog/homeSection.val.ts`: add it to `homeSection` too, the front page's list. (A section that reads the posts is made like `latestPostsSection.val.ts` instead: in `homeSection`, `homeSectionPreview` and `HomeSection.tsx`, not in `anySection`.)
6. To show one: `{ type: "<kind>", ... }` in `sections` in `src/routes/_site.index.val.ts`. Nothing goes in `val.modules.ts`.

### Add a field to a section, or to any schema

1. The schema file: add the field, `.nullable()` unless every existing entry is given a value.
2. Every entry of it in the content modules (sections: `src/routes/_site.index.val.ts`; posts: `src/routes/_site.blog.$slug.val.ts`; authors: `src/content/authors.val.ts`) and in `src/components/sections/Sections.stories.tsx`: add the key (`null` if nullable). Content must match the schema exactly.
3. The component: read the prop and render it.

A post's field is drawn in `src/routes/_site.blog.$slug.tsx` (the post), `src/components/blog/PostCard.tsx` (every list) and `src/routes/rss[.]xml.ts` (the feed); an author's in `src/components/blog/Byline.tsx`.

### Add a page

1. `src/routes/_site.<name>.tsx`: copy `src/routes/_site.index.tsx`; the route id becomes `createFileRoute("/_site/<name>")` and the import `./_site.<name>.val`.
2. `src/routes/_site.<name>.val.ts`: copy `src/routes/_site.index.val.ts`; `c.define`'s first argument becomes `"/src/routes/_site.<name>.val.ts"` and the one key `"/<name>"`.
3. `val.modules.ts`: add `{ def: () => import("./src/routes/_site.<name>.val") },`.
4. `src/components/Header.tsx`: a `<Link to="/<name>">` in the `<nav>`, if it belongs in the navigation.

A new route needs a build; the build rewrites `src/routeTree.gen.ts` (locally, `npm run dev` does). For many pages of one kind, copy `src/routes/_site.blog.$slug.tsx` and its `.val.ts`: one route, a page per key.

### Change the header or footer

`src/components/Header.tsx` (the first link is the site's name, the `<nav>` its navigation) and `src/components/Footer.tsx`. Their text is JSX. To let editors change it, move it into a content module (`src/content/<name>.val.ts`, registered in `val.modules.ts`) and read it with `useVal`.

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

- `val.config.ts` exports `s` (schemas), `c` (`c.define`), `val` (helpers) and `tanstackRouter`.
- **Every content module is registered in `val.modules.ts`**, or the Studio does not know it.
- `export default c.define(...)` is written inline: assigned to a const first, it validates and then fails at publish time. Its first argument is the module's own path from the repository root, starting with `/`.
- A route's content is named after its route file (`.tsx` becomes `.val.ts`) and keyed by the URLs it serves. `.` and `/` separate segments, `$param` is a parameter, `$` a splat; `index`, `route`, `(groups)` and `_pathless` layouts add no segment.
- `routeFileIgnorePattern` in `vite.config.ts` and `tsr.config.json` keeps `*.val.ts` out of the route generator. Leave it.
- Every page goes under the `_site` layout. `__root.tsx` is the shell for `/val` too: nothing site-specific goes in it.
- Read content with `useVal` / `useValRoute` from `src/val/val.hooks.ts`: on the server and in the browser, click-to-editable. Read on the server (`src/val/val.server.ts`) only what must exist before the component does (`head`, a redirect, `notFound()`), and only **through `createServerFn`**: a `loader` runs in the browser too, and `val.server` would put Node's `fs` in the client bundle. `src/routes/_site.blog.$slug.tsx` is the worked example.
- Strings read through Val carry an invisible edit tag: use `val.raw()` wherever one must be exact (a URL, a `key`, a comparison, `<title>`). `.env.development` turns on analytics that warn in the browser console when a tag leaves React; fix that with `val.raw()`, not by turning them off.
- `settings.val.ts` (`s.settings()`) is filled in by editors in the Studio. Keep its content a plain object literal.
- Media is picked from the libraries (`src/media/README.md`): a field stores only `{ path }`, and the size, type and default alt text are the library's.
- Working locally, run `npm run validate` after changing content: it checks the content against the schemas and fixes what it can.

## The blog

- Adding a post is content only: an entry of `src/routes/_site.blog.$slug.val.ts`, keyed by its URL (`/blog/<slug>`).
- Posts are listed newest first, by `published`, with `newestFirst` in `src/components/blog/posts.ts`. Compare and sort `val.raw` values.
- `author` is a key of `src/content/authors.val.ts` (`s.keyOf`): look it up with `val.raw(post.author)`.
- A post's body links are plain strings, so they can leave the site. The shared `Prose` (`a: true`) only links to the site's own routes.

## Architecture and theme

**TABS**: Typography, Atoms, Base, Sections (`src/components/README.md`). **Pages compose Sections and nothing else**; a section composes the three layers under it.

How the site looks is content: an editor picks a preset in `src/theme/theme.val.ts` and overrides single choices. `resolveTheme` and `themeCss` turn that into CSS variables, which `src/routes/_site.tsx` renders.

- **Components read tokens, never colours**: a literal colour is wrong in dark mode or on a brand section.
- **Backgrounds are surfaces.** A section sets `data-surface` (`default`, `muted`, `brand`, `inverse`) and everything inside follows. `pnpm test` checks every text colour on every surface against WCAG AA: run it after changing a surface or a ramp.
- **Components never import the framework**: router links and Val's renderers come from `src/framework.tsx`.
- `/styleguide` and `pnpm storybook` show every component under the theme.

<!-- val:mcp:start -->

## Content tools (MCP)

Val's content tools are served over MCP at `/api/mcp` (`src/routes/api/mcp.ts`,
`src/val/mcp.server.ts`). In local development an agent can read, validate and edit
content there; a production build refuses unless the project is connected to
Val Build and OAuth is configured — see README.md.

<!-- val:mcp:end -->
