import { s, type t } from "../../../val.config";

/**
 * A link from content: a page of this site, picked from a list, or any URL.
 *
 * Two shapes because they fail differently. A page link is checked by Val —
 * rename or delete the page and validation says so — while a URL is only
 * checked for its form.
 */
export const externalHrefSchema = s.string().validate((href) => {
  if (!href.startsWith("http") && !href.startsWith("/")) {
    return "A URL starts with http:// or https://, or with / for a path on this site";
  }
  return false;
});

export const linkSchema = s.discriminatedUnion(
  "type",
  s.object({
    type: s.literal("internal"),
    label: s.string().maxLength(40),
    href: s.route(),
  }),
  s.object({
    type: s.literal("external"),
    label: s.string().maxLength(40),
    href: externalHrefSchema,
  }),
);

export type LinkSchema = t.inferSchema<typeof linkSchema>;
