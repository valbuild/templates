import { s, type t } from "../../../val.config";
import { linkButtonsSchema } from "../atoms/linkButton.val";
import { proseSchema } from "../typography/prose.val";
import { surfaceSchema } from "../base/surface.val";

export const titleTextSection = s.object({
  type: s.literal("title-text"),
  surface: surfaceSchema,
  title: s.string(),
  text: proseSchema,
  buttons: linkButtonsSchema(3),
});
export type TitleTextSectionSchema = t.inferSchema<typeof titleTextSection>;
