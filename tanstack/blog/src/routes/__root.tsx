import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

/**
 * The document shell for EVERY route, Val Studio included.
 *
 * So it holds nothing of the site — no stylesheet, no theme script, no
 * header, no `ValProvider`. The site's own things are on `_site.tsx`, the
 * pathless layout every page sits under, and the Studio's on `val/route.tsx`.
 * Anything put here would also reach the Studio: an inherited CSS property
 * passes into its shadow DOM, and `color-scheme` changes its scrollbars and
 * form controls.
 */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
