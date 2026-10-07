import { val } from "../../../val.config";
import type { PostSchema } from "./post.val";

export type PostEntry = { url: string; post: PostSchema };

/**
 * Every post, newest first.
 *
 * `val.raw` on the date and the URL, because what the hooks hand back carries
 * an invisible edit tag in every string — fine to render, wrong to compare or
 * sort by. The post itself is left as it is, so it stays editable on the page.
 */
export function newestFirst(posts: Record<string, PostSchema>): PostEntry[] {
  return Object.entries(posts)
    .map(([url, post]) => ({ url: val.raw(url), post }))
    .sort((a, b) =>
      val.raw(b.post.published).localeCompare(val.raw(a.post.published)),
    );
}

const DATE_FORMAT = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  // A date with no time is a calendar day, the same everywhere. Without this
  // a reader west of UTC sees the day before, and the server and browser can
  // render different days and fail to hydrate.
  timeZone: "UTC",
});

/** `2026-10-01` as people read it: `October 1, 2026`. */
export function formatDate(date: string): string {
  const raw = val.raw(date);
  const parsed = new Date(`${raw}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? raw : DATE_FORMAT.format(parsed);
}
