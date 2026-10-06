/**
 * Whether a link goes to a page of this site, and should navigate without a
 * page load. Not: other sites, Val Studio (`/val`, a separate app), Val's API
 * (`/api/...`, where a draft file is served from) and anything that names a
 * file (`/val/files/guide.pdf`) — those are full page loads.
 */
export function isInternalHref(href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return false;
  }
  const path = href.split(/[?#]/)[0];
  if (path === "/val" || path.startsWith("/val/") || path.startsWith("/api/")) {
    return false;
  }
  const lastSegment = path.slice(path.lastIndexOf("/") + 1);
  return !lastSegment.includes(".");
}
