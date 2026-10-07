import { val } from "../../../val.config";
import { RouterLink } from "../../framework";
import { cn } from "../../utils/cn";
import { isInternalHref } from "../../utils/href";

/**
 * A link in running text. Its colour and underline come from the theme
 * (`atoms.link.underline`), and it stays readable on every surface.
 */
export function TextLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  // `val.raw` strips the invisible edit tag out of the URL — it must not be
  // sent to a server — and `val.attrs` puts the path it carried back on the
  // element, which is what keeps the link editable in the Studio.
  const url = val.raw(href);
  const props = {
    className: cn("text-link", className),
    ...val.attrs({ href, children }),
  };
  return isInternalHref(url) ? (
    <RouterLink href={url} {...props}>
      {children}
    </RouterLink>
  ) : (
    <a href={url} {...props}>
      {children}
    </a>
  );
}
