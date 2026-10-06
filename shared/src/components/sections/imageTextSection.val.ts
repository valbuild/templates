import { s, type t } from "../../../val.config";
import { proseSchema } from "../typography/prose.val";
import { surfaceSchema } from "../base/surface.val";

export const imageTextSection = s.object({
  type: s.literal("image-text"),
  image: s.image().nullable(),
  surface: surfaceSchema,
  title: s.string(),
  text: proseSchema,
});
export type ImageTextSectionSchema = t.inferSchema<typeof imageTextSection>;
