import { s, type t } from "../../../val.config";
import filesVal from "../../media/files.val";

/**
 * A link from content: a page of this site, picked from a list; any URL; or a
 * file to download, picked from the file library.
 *
 * Separate shapes because they fail differently. A page link is checked by
 * Val — rename or delete the page and validation says so — a file link must
 * name a file the library has, and a URL is only checked for its form.
 */
export const externalHrefSchema = s.string().validate((href) => {
  if (!href.startsWith("http") && !href.startsWith("/")) {
    return "A URL starts with http:// or https://, or with / for a path on this site";
  }
  return false;
});

const label = s.string().maxLength(40);

export const linkSchema = s.discriminatedUnion(
  "type",
  s.object({ type: s.literal("internal"), label, href: s.route() }),
  s.object({ type: s.literal("external"), label, href: externalHrefSchema }),
  s.object({ type: s.literal("file"), label, file: s.file(filesVal) }),
);

export type LinkSchema = t.inferSchema<typeof linkSchema>;
