import { s, type t } from "../../../val.config";
import iconsVal from "../../media/icons.val";

/**
 * An icon, picked from the icon library (`src/media/icons.val.ts`).
 *
 * It is drawn as a MASK, so it takes the colour of the text around it and
 * follows the theme and the surface — an uploaded icon is never the wrong
 * colour for the section it is in. That only works for single-colour icons
 * (most icon sets), which is what an icon should be anyway.
 */
export const iconSchema = s
  .image(iconsVal)
  .describe("A single-colour SVG. It takes the colour of the text around it.");

export type IconSchema = t.inferSchema<typeof iconSchema>;
