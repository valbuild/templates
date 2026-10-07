import type { SelectorOfSchema } from "@valbuild/core";
import { s, type t } from "../../../val.config";
import imagesVal from "../../media/images.val";

/**
 * Where a link in the docs may go: anywhere.
 *
 * Not `a: true`, which only allows this site's own routes — the docs link out
 * to other sites as often as within themselves.
 */
const docLinkSchema = s
  .string()
  .validate((href) =>
    /^(https?:\/\/|\/|mailto:|#)/.test(href)
      ? false
      : "A link starts with https://, a / for a page of this site, mailto: or #.",
  );

/** Running text in the docs: headings, lists, links and images. */
export const docTextSchema = s.richtext({
  bold: true,
  italic: true,
  lineThrough: true,
  h2: true,
  h3: true,
  ul: true,
  ol: true,
  a: docLinkSchema,
  img: s.image(imagesVal),
});

export type DocTextSchema = t.inferSchema<typeof docTextSchema>;

/**
 * The blocks a page is made of. Rich text has no code, so code is a block of
 * its own — which is also what lets it have a file name and a copy button.
 */
export const docBlock = s.discriminatedUnion(
  "type",
  s.object({
    type: s.literal("text"),
    text: docTextSchema,
  }),
  s.object({
    type: s.literal("code"),
    filename: s
      .string()
      .maxLength(80)
      .nullable()
      .describe("Shown above the code, like “src/routes/index.tsx”."),
    code: s.string().multiline(),
  }),
  s.object({
    type: s.literal("callout"),
    tone: s
      .enum("note", "tip", "warning")
      .describe(
        "Note: worth knowing. Tip: a better way. Warning: a way to lose work.",
      ),
    title: s.string().maxLength(80).nullable(),
    text: docTextSchema,
  }),
);

export type DocBlockSchema = t.inferSchema<typeof docBlock>;

export const docPageSchema = s.object({
  title: s.string().minLength(1).maxLength(120),
  description: s
    .string()
    .maxLength(200)
    .multiline()
    .nullable()
    .describe("One sentence under the title, and what search engines show."),
  group: s
    .string()
    .minLength(1)
    .maxLength(60)
    .describe(
      "The heading this page is listed under in the sidebar. Pages with the same group are listed together; capitals and spaces at the ends do not matter.",
    ),
  next: s
    .route()
    .include(/^\/docs\//)
    .nullable()
    .describe(
      "The page to read after this one. It is the Next link at the bottom of this page, and it orders the sidebar. Previous is worked out from it.",
    ),
  blocks: s.array(
    docBlock.preview(({ val }) => {
      if (val.type === "code") {
        return {
          title: val.filename ?? "Code",
          subtitle: val.code.split("\n")[0] ?? null,
        };
      } else if (val.type === "callout") {
        return { title: val.title ?? val.tone, subtitle: null };
      }
      return { title: "Text", subtitle: null };
    }),
  ),
});

export type DocPageSchema = t.inferSchema<typeof docPageSchema>;

export const docPagePreview = ({
  val,
}: {
  val: SelectorOfSchema<typeof docPageSchema>;
}) => ({
  title: val.title,
  subtitle: val.group,
});
