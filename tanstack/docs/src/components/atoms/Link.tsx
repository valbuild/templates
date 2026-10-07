import { val } from "../../../val.config";
import { RouterLink } from "../../framework";
import { isInternalHref } from "../../utils/href";

/**
 * An unstyled link that works for both kinds of href Val produces: a path in
 * this site navigates without a page load, anything else is a plain anchor.
 *
 * Safe to hand a stega-encoded href from content: the edit tag is taken out of
 * the URL and put back on the element, so the link stays editable in the
 * Studio. For a link in running text use `TextLink`; for one that looks like a
 * button, `LinkButton`.
 */
export function Link({
  href,
  children,
  ...props
}: { href: string } & Omit<React.ComponentProps<"a">, "href">) {
  const url = val.raw(href);
  const attrs = val.attrs({ href });
  return isInternalHref(url) ? (
    <RouterLink href={url} {...attrs} {...props}>
      {children}
    </RouterLink>
  ) : (
    <a href={url} {...attrs} {...props}>
      {children}
    </a>
  );
}
