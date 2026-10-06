/**
 * Where a link from content goes: its `href`, or for a file link the URL the
 * file is served from. Typed structurally, so it takes a `LinkSchema` and a
 * `LinkButtonSchema` alike.
 */
export function hrefOf(
  link:
    | { readonly type: "internal" | "external"; readonly href: string }
    | { readonly type: "file"; readonly file: { readonly url: string } },
): string {
  return link.type === "file" ? link.file.url : link.href;
}
