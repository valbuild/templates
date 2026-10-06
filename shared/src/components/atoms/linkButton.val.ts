import { s, type t } from "../../../val.config";
import { externalHrefSchema } from "./link.val";

const commonFields = {
  label: s.string().maxLength(40),
  variant: s
    .enum("primary", "secondary")
    .describe(
      "Primary is the one thing you want people to do here. Use at most one per section.",
    ),
};
export const linkButtonSchema = s.discriminatedUnion(
  "type",
  s.object({
    type: s.literal("external"),
    href: externalHrefSchema,
    ...commonFields,
  }),
  s.object({
    type: s.literal("internal"),
    href: s.route(),
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
        subtitle: val.href,
      })),
    )
    .validate((buttons) =>
      buttons.length > max ? `At most ${max} buttons here.` : false,
    );
}
