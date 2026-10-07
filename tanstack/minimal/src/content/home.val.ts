import { s, c } from "../../val.config";

/*
 * The content of the home page (`src/routes/_site.index.tsx`).
 *
 * A plain module: one page, one object. When the site grows more pages of the
 * same kind, the Val way is a router module named after the route file, keyed
 * by URL — see "Adding pages" in README.md.
 */
export default c.define(
  "/src/content/home.val.ts",
  s.object({
    title: s.string().maxLength(80),
    text: s.string().multiline(),
  }),
  {
    title: "Hello, Val",
    text: "This page is content. Open Val Studio, change this text, and watch the page follow.\n\nWhen you are ready to build your own site, delete this page and start from an empty one.",
  },
);
