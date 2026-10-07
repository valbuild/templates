import type { Metadata } from "next";
import { ValProvider } from "@valbuild/next";
import { config, val } from "../../../val.config";
import { ValModulesClient } from "../ValModulesClient";
import { fetchVal } from "@/val/val.rsc";
import themeVal from "@/theme/theme.val";
import { resolveTheme } from "@/theme/resolveTheme";
import { ThemeRoot } from "@/theme/ThemeRoot";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

/*
 * A visitor's own light/dark choice, applied before the first paint so the
 * page never flashes the other mode. `data-theme` on <html> overrides the
 * site's default, which `theme.val.ts` sets; no stored choice means the
 * default stands. `ThemeToggle` writes the same key.
 */
const THEME_INIT_SCRIPT = `(function(){try{var m=window.localStorage.getItem('theme');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m)}}catch(e){}})();`;

export const metadata: Metadata = {
  title: { default: "Your site", template: "%s · Your site" },
};

/**
 * The site's root layout — everything except Val Studio, which has its own in
 * `(val)`. Put every page of your site in the `(main)` group, so this layout
 * (and the Val overlay in it) is never wrapped around the editor.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /*
   * The theme is content, read on the server like any other: an editor
   * changing it in the Studio sees the whole site follow. `val.raw`, because
   * every value here ends up in CSS, where an edit tag would be garbage.
   */
  const theme = resolveTheme(val.raw(await fetchVal(themeVal)));
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {/*
         * Everything the site renders goes inside ValProvider: it mounts the
         * Studio overlay and refreshes the page when an edit lands.
         */}
        <ValProvider config={config}>
          {/* Hands the Studio your schemas. Needed here AND on /val. */}
          <ValModulesClient />
          <ThemeRoot theme={theme} className="flex min-h-screen flex-col">
            <Header toggle={theme.toggle} />
            <div className="flex-1">{children}</div>
            <Footer />
          </ThemeRoot>
        </ValProvider>
      </body>
    </html>
  );
}
