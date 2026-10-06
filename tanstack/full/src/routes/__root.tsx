import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import appCss from "../styles.css?url";

/*
 * A visitor's own light/dark choice, applied before the first paint so the
 * page never flashes the other mode. `data-theme` on <html> overrides the
 * site's default, which `theme.val.ts` sets; no stored choice means the
 * default stands. `ThemeToggle` writes the same key.
 */
const THEME_INIT_SCRIPT = `(function(){try{var m=window.localStorage.getItem('theme');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m)}}catch(e){}})();`;

/**
 * The document shell for EVERY route, Val Studio included.
 *
 * So it holds nothing of the site: no header, no footer, no `ValProvider`.
 * Those live in `_site.tsx`, the pathless layout the site's own pages sit
 * under — which is what keeps them off `/val`. The Studio is a full-screen app
 * and should not be rendered inside the site it is editing.
 */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="antialiased [overflow-wrap:anywhere]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
