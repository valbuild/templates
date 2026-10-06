import { s, type t } from "../../../val.config";
import filesVal from "../../media/files.val";
import { externalHrefSchema } from "./link.val";

const commonFields = {
  label: s.string().maxLength(40),
  variant: s
    .enum("primary", "secondary")
    .describe(
      "Primary is the one thing you want people to do here. Use at most one per section.",
    ),
};

/** A link drawn as a button. The same three kinds as `linkSchema`. */
export const linkButtonSchema = s.discriminatedUnion(
  "type",
  s.object({
    type: s.literal("internal"),
    href: s.route(),
    ...commonFields,
  }),
  s.object({
    type: s.literal("external"),
    href: externalHrefSchema,
    ...commonFields,
  }),
  s.object({
    type: s.literal("file"),
    file: s.file(filesVal),
    ...commonFields,
  }),
);

export type LinkButtonSchema = t.inferSchema<typeof linkButtonSchema>;

/** Zero to `max` buttons, each previewed by its label. */
export function linkButtonsSchema(max: number) {
  return s
    .array(
      linkButtonSchema.preview(({ val }) => ({
        title: val.label,
        subtitle: val.type === "file" ? val.file.path : val.href,
      })),
    )
    .validate((buttons) =>
      buttons.length > max ? `At most ${max} buttons here.` : false,
    );
}
