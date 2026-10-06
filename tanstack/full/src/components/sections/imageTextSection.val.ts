import { s, type t } from "../../../val.config";
import imagesVal from "../../media/images.val";
import { proseSchema } from "../typography/prose.val";
import { surfaceSchema } from "../base/surface.val";

export const imageTextSection = s.object({
  type: s.literal("image-text"),
  image: s.image(imagesVal).nullable(),
  imageSide: s
    .enum("left", "right")
    .describe(
      "Which side the image is on, on a laptop. On a phone it is always above.",
    ),
  surface: surfaceSchema,
  title: s.string(),
  text: proseSchema,
});
export type ImageTextSectionSchema = t.inferSchema<typeof imageTextSection>;
