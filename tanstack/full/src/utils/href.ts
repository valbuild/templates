/**
 * Whether a link goes somewhere in this site, and should navigate without a
 * page load. `/val` is the exception: it is Val Studio, a separate app.
 */
export function isInternalHref(href: string): boolean {
  return (
    href.startsWith("/") &&
    !href.startsWith("//") &&
    href !== "/val" &&
    !href.startsWith("/val/")
  );
}
