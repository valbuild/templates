import { s, type t } from "../../../val.config";
import { proseSchema, proseToString } from "../typography/prose.val";
import { surfaceSchema } from "../base/surface.val";
import { sectionHeaderFields } from "./sectionHeader.val";

/** Accordion: questions or topics that open to show more. FAQs, details. */
export const accordionSection = s.object({
  type: s.literal("accordion"),
  ...sectionHeaderFields,
  items: s
    .array(
      s
        .object({
          question: s.string().maxLength(160),
          answer: proseSchema,
        })
        .preview(({ val }) => ({
          title: val.question,
          subtitle: proseToString(val.answer),
        })),
    )
    .validate((items) =>
      items.length === 0 ? "Add at least one item." : false,
    ),
  oneAtATime: s.boolean().describe("Opening one item closes the others."),
  surface: surfaceSchema,
});

export type AccordionSectionSchema = t.inferSchema<typeof accordionSection>;
