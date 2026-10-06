import { s, type t } from "../../../val.config";
import imagesVal from "../../media/images.val";
import { surfaceSchema } from "../base/surface.val";
import { sectionHeaderFields } from "./sectionHeader.val";

/** Media Carousel: images in a row that scrolls sideways, with captions. */
export const mediaCarouselSection = s.object({
  type: s.literal("media-carousel"),
  ...sectionHeaderFields,
  slides: s
    .array(
      s
        .object({
          image: s.image(imagesVal),
          caption: s.string().maxLength(160).nullable(),
        })
        .preview(({ val }) => ({
          title: val.caption ?? "Slide",
          image: val.image,
        })),
    )
    .validate((slides) =>
      slides.length < 2 ? "A carousel needs at least two slides." : false,
    ),
  surface: surfaceSchema,
});

export type MediaCarouselSectionSchema = t.inferSchema<
  typeof mediaCarouselSection
>;
