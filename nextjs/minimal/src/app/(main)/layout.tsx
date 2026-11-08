import { ValProvider } from "@valbuild/next";
import { config } from "../../../val.config";
import { ValModulesClient } from "../ValModulesClient";
import { fetchValDraft } from "@/val/val.rsc";
import "../globals.css";

export const metadata = {
  title: "Hello, Val",
};

/**
 * The site's root layout — everything except Val Studio, which has its own in
 * `(val)`. Put every page of your site in the `(main)` group, so this layout
 * (and the Val overlay in it) is never wrapped around the editor.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/*
         * Everything the site renders goes inside ValProvider: it mounts the
         * Studio overlay and refreshes the page when an edit lands.
         *
         * `draft` is the editor's unpublished draft, read on the server for
         * this request, so a client component (`useVal` from
         * `@/val/val.client`) renders the draft from the first byte instead
         * of the published text first. It is `null` for a visitor, after one
         * `draftMode()` lookup that does not make the page dynamic.
         */}
        <ValProvider config={config} draft={await fetchValDraft()}>
          {/* Hands the Studio your schemas. Needed here AND on /val. */}
          <ValModulesClient />
          {children}
        </ValProvider>
      </body>
    </html>
  );
}
