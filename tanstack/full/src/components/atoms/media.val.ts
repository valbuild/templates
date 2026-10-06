import { s, type t } from "../../../val.config";

/**
 * An image or a video, wherever a section shows "media".
 *
 * One schema, so every section that takes media takes both, and an editor who
 * swaps a photo for a clip does it the same way everywhere.
 */
export const mediaSchema = s.discriminatedUnion(
  "type",
  s.object({
    type: s.literal("image"),
    image: s.image(),
  }),
  s.object({
    type: s.literal("video"),
    video: s.video(),
  }),
);

export type MediaSchema = t.inferSchema<typeof mediaSchema>;
