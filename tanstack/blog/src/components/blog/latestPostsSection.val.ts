import { s, type t } from "../../../val.config";
import { surfaceSchema } from "../base/surface.val";
import { sectionHeaderFields } from "../sections/sectionHeader.val";

/**
 * Latest Posts: the newest posts, as cards. The posts are not picked here —
 * this always shows the newest, so a new post appears on the front page the
 * moment it is published.
 */
export const latestPostsSection = s.object({
  type: s.literal("latest-posts"),
  ...sectionHeaderFields,
  count: s
    .number({ min: 1, max: 12 })
    .describe("How many of the newest posts to show."),
  surface: surfaceSchema,
});

export type LatestPostsSectionSchema = t.inferSchema<typeof latestPostsSection>;
