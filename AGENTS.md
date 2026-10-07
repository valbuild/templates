# Working in this repository

Read [README.md](README.md) first: it explains the layout and why shared code is
COPIED into each template rather than imported.

The rules that are easy to break:

- **Edit shared code in `shared/`, or pull it back.** A file under a path listed
  in `templates.json` is a copy. Change it in a template and you must run
  `node scripts/sync.mjs --pull <template>` and then `node scripts/sync.mjs`,
  or CI fails on `--check`.
- **Shared code never imports a framework.** Router links, `ValImage`,
  `ValRichText`, `ValVideo` and Val's types come from the template's
  `src/framework.tsx`.
- **Each template is its own project**, with its own lockfile and its own
  `AGENTS.md` that ships to users. Run its checks from its folder.
- **A change to `shared/` lands in both Full templates** (TanStack and Next.js).
  Check it in both. A shared component with state needs `"use client"` for
  Next.js; one that imports `next/*` or `@tanstack/*` breaks the other.

Before pushing a change to `shared/` or to a Full template, from **both**
`tanstack/full` and `nextjs/full`:

```bash
pnpm run typecheck && pnpm run lint && pnpm exec prettier --check . \
  && pnpm test && pnpm run build && pnpm exec val validate \
  && pnpm run build-storybook
```

For a Minimal template, the same without `test` and `build-storybook`.
