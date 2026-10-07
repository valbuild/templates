import type { SelectorOfSchema } from "@valbuild/core";
import { s, type t } from "../../../val.config";
import authorsVal from "../../content/authors.val";
import imagesVal from "../../media/images.val";

/**
 * Where a link in a post may go: anywhere.
 *
 * Not `a: true`, which is what `Prose` uses: that checks a link against this
 * site's routes, which catches a broken internal link and refuses every
 * external one — and a post that cannot link out is not much of a post.
 */
const postLinkSchema = s
  .string()
  .validate((href) =>
    /^(https?:\/\/|\/|mailto:|#)/.test(href)
      ? false
      : "A link starts with https://, a / for a page of this site, mailto: or #.",
  );

/**
 * The body of a post: what the shared `Prose` allows, plus images, and links
 * that may leave the site.
 *
 * An image in the body is picked from the image library like any other
 * (`s.image(imagesVal)`), so it has its size, type and alt text from there, and
 * is one upload however many posts use it.
 */
export const postBodySchema = s.richtext({
  bold: true,
  italic: true,
  lineThrough: true,
  h2: true,
  h3: true,
  ul: true,
  ol: true,
  a: postLinkSchema,
  img: s.image(imagesVal),
});

export type PostBodySchema = t.inferSchema<typeof postBodySchema>;

export const postSchema = s.object({
  title: s.string().minLength(1).maxLength(120),
  description: s
    .string()
    .minLength(1)
    .maxLength(200)
    .multiline()
    .describe(
      "One or two sentences. Shown under the title in every list of posts, and to search engines.",
    ),
  published: s.date().describe("Posts are listed newest first, by this date."),
  author: s.keyOf(authorsVal),
  cover: s
    .image(imagesVal)
    .nullable()
    .describe("Shown above the post, and on its card in a list."),
  body: postBodySchema,
});

export type PostSchema = t.inferSchema<typeof postSchema>;

export const postPreview = ({
  val,
}: {
  val: SelectorOfSchema<typeof postSchema>;
}) => ({
  title: val.title,
  subtitle: val.published,
  image: val.cover,
});
