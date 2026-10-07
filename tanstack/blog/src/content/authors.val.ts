import { s, c, type t } from "../../val.config";
import imagesVal from "../media/images.val";

/**
 * The people who write the posts. A post names its author by key, with
 * `s.keyOf(authorsVal)`, so renaming someone here renames them on every post,
 * and the Studio offers this list when a post's author is picked.
 *
 * Not a page: an author has no URL of their own in this template. Give them
 * one by adding a route, `_site.authors.$author.tsx`, that reads this module.
 */
export const authorSchema = s.object({
  name: s.string().minLength(1),
  role: s
    .string()
    .nullable()
    .describe("A few words under the name, like “Editor”."),
  avatar: s.image(imagesVal).nullable(),
  bio: s.string().multiline().nullable(),
});

export type AuthorSchema = t.inferSchema<typeof authorSchema>;

export default c.define(
  "/src/content/authors.val.ts",
  s.record(
    s
      .string()
      .regexp(/^[a-z0-9-]+$/)
      .describe("A short id for the author: lower case, no spaces."),
    authorSchema.preview(({ val }) => ({
      title: val.name,
      subtitle: val.role,
      image: val.avatar,
    })),
  ),
  {
    ada: {
      name: "Ada Hansen",
      role: "Editor",
      avatar: { path: "/public/val/images/avatar-ada.svg" },
      bio: "Writes about content, and about the code that holds it.",
    },
    linus: {
      name: "Linus Berg",
      role: "Developer",
      avatar: { path: "/public/val/images/avatar-linus.svg" },
      bio: "Builds the site, and occasionally explains it.",
    },
  },
);
