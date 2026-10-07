import { s, type t } from "../../../val.config";
import imagesVal from "../../media/images.val";
import videosVal from "../../media/videos.val";

/**
 * An image or a video, wherever a section shows "media".
 *
 * One schema, so every section that takes media takes both, and an editor who
 * swaps a photo for a clip does it the same way everywhere. Both pick from the
 * site's libraries (`src/media`).
 */
export const mediaSchema = s.discriminatedUnion(
  "type",
  s.object({
    type: s.literal("image"),
    image: s.image(imagesVal),
  }),
  s.object({
    type: s.literal("video"),
    video: s.video(videosVal),
  }),
);

export type MediaSchema = t.inferSchema<typeof mediaSchema>;
