import { s, type t } from "../../../val.config";
import { linkSchema } from "../atoms/link.val";
import { surfaceSchema } from "../base/surface.val";
import { sectionHeaderFields } from "./sectionHeader.val";

export const cardSchema = s.object({
  image: s.image().nullable(),
  tag: s
    .string()
    .maxLength(24)
    .nullable()
    .describe("A short label on the card."),
  title: s.string().maxLength(80),
  text: s.string().multiline().maxLength(240).nullable(),
  link: linkSchema.nullable().describe("Where the card leads. Empty: no link."),
});

/** Card Grid: a set of things of the same kind, in 2, 3 or 4 columns. */
export const cardGridSection = s.object({
  type: s.literal("card-grid"),
  ...sectionHeaderFields,
  columns: s
    .enum("2", "3", "4")
    .describe("On a laptop. Phones always show one, tablets two."),
  cards: s
    .array(
      cardSchema.preview(({ val }) => ({
        title: val.title,
        subtitle: val.text,
        image: val.image,
      })),
    )
    .validate((cards) =>
      cards.length === 0 ? "Add at least one card." : false,
    ),
  surface: surfaceSchema,
});

export type CardGridSectionSchema = t.inferSchema<typeof cardGridSection>;
