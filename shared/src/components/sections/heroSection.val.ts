import { s, type t } from "../../../val.config";
import { mediaSchema } from "../atoms/media.val";
import { linkButtonsSchema } from "../atoms/linkButton.val";
import { surfaceSchema } from "../base/surface.val";
import { sectionHeaderFields } from "./sectionHeader.val";

/**
 * Centered Hero: the big opening of a page.
 *
 * Its variants are not a setting, they are what is filled in: no buttons and
 * no background is the minimal hero, buttons make it a call to action, and a
 * background image or video puts the text over it.
 */
export const heroSection = s.object({
  type: s.literal("hero"),
  ...sectionHeaderFields,
  buttons: linkButtonsSchema(2),
  background: mediaSchema
    .nullable()
    .describe(
      "Shown behind the text, darkened so the text stays readable. Empty: the hero sits on its surface.",
    ),
  surface: surfaceSchema,
});

export type HeroSectionSchema = t.inferSchema<typeof heroSection>;
