import { s, type t } from "../../../val.config";

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
    href: s.string().validate((href) => {
      if (!href.startsWith("http") && !href.startsWith("/")) {
        return "External links must start with http or https or be a relative path";
      }
      return false;
    }),
    ...commonFields,
  }),
  s.object({
    type: s.literal("internal"),
    href: s.route(),
    ...commonFields,
  }),
);

export type LinkButtonSchema = t.inferSchema<typeof linkButtonSchema>;
