import { ValProvider } from "@valbuild/next";
import { config } from "../../../val.config";
import { ValModulesClient } from "../ValModulesClient";
import "../globals.css";

export const metadata = {
  title: "Hello, Val",
};

/**
 * The site's root layout — everything except Val Studio, which has its own in
 * `(val)`. Put every page of your site in the `(main)` group, so this layout
 * (and the Val overlay in it) is never wrapped around the editor.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/*
         * Everything the site renders goes inside ValProvider: it mounts the
         * Studio overlay and refreshes the page when an edit lands.
         */}
        <ValProvider config={config}>
          {/* Hands the Studio your schemas. Needed here AND on /val. */}
          <ValModulesClient />
          {children}
        </ValProvider>
      </body>
    </html>
  );
}
