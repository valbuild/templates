import { Outlet, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Suspense } from "react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ValModulesClient, ValProvider } from "@valbuild/tanstack";
import { config, val } from "../../val.config";
import valModules from "../../val.modules";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { fetchValDraft } from "../val/val.server";
import { useVal } from "../val/val.hooks";
import themeVal from "../theme/theme.val";
import { resolveTheme } from "../theme/resolveTheme";
import { ThemeRoot } from "../theme/ThemeRoot";
import appCss from "../styles.css?url";

/*
 * A visitor's own light/dark choice, applied before the first paint so the
 * page never flashes the other mode. `data-theme` on <html> overrides the
 * site's default, which `theme.val.ts` sets; no stored choice means the
 * default stands. `ThemeToggle` writes the same key.
 */
const THEME_INIT_SCRIPT = `(function(){try{var m=window.localStorage.getItem('theme');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m)}}catch(e){}})();`;

/**
 * The draft this request renders, when an editor is previewing; `null` for
 * everyone else, after one cookie lookup.
 *
 * Through `createServerFn` for the reason `_site.products.$sku.tsx` gives: a
 * loader runs in the browser too, and `val.server` must not end up there.
 */
const getValDraft = createServerFn().handler(() => fetchValDraft());

/**
 * The site's layout — everything except Val Studio.
 *
 * Pathless (`_site`), so it adds no URL segment: `_site.index.tsx` is still `/`
 * and `_site.products.$sku.tsx` is still `/products/$sku`. Val modules named
 * after those files follow the same rule, so `_site.products.$sku.val.ts` holds
 * `/products/...` keys.
 *
 * Put every page of your site under here. Keeping it out of `__root` is what
 * keeps the header, the footer and the Val overlay off `/val`.
 */
export const Route = createFileRoute("/_site")({
  /*
   * The site's stylesheet and theme script belong to the site's pages, not
   * to `__root`: that is the shell for Val Studio too, which must not inherit
   * the site's fonts, line height or colour scheme. Both are in <head> on the
   * server render, so the first paint is already styled.
   */
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [{ children: THEME_INIT_SCRIPT }],
  }),
  /*
   * On the server only. The draft is for the render that has no other way to
   * get it -- the first one, and the browser's hydration of it, which reuses
   * this loader's data. After that the Val overlay keeps the page up to date,
   * so a client navigation reads nothing and asks the server for nothing.
   */
  loader: () => (typeof document === "undefined" ? getValDraft() : null),
  component: SiteLayout,
});

function SiteLayout() {
  const draft = Route.useLoaderData();
  return (
    /*
     * Everything the site renders goes inside ValProvider: it mounts the Studio
     * overlay, receives edits from it, and re-runs the loaders when one lands.
     *
     * `suspend` opts into the Suspense gate, so a page that exists only in an
     * unpublished draft renders instead of 404ing. Visitors without the Val
     * Enable cookie pay nothing for it.
     *
     * `draft` is what the server rendered this page with, so the browser's
     * first render agrees with it and a draft never shows the published text
     * first.
     */
    <ValProvider config={config} suspend draft={draft}>
      {/* Hands the Studio your schemas. Needed here AND on the /val route. */}
      <ValModulesClient modules={valModules} />
      {/*
       * Its own boundary: reading the theme can suspend like any other
       * content read, and there is nothing above this to catch it.
       */}
      <Suspense fallback={null}>
        <ThemedSite />
      </Suspense>
    </ValProvider>
  );
}

/**
 * Inside `ValProvider`, so the theme is read like any other content: an editor
 * changing it in the Studio sees the whole site follow as they click.
 */
function ThemedSite() {
  /*
   * `val.raw`, because every value here ends up in CSS. The edit tags that
   * make text click-to-edit would be garbage inside a colour or a font URL.
   */
  const theme = resolveTheme(val.raw(useVal(themeVal)));
  return (
    <ThemeRoot theme={theme} className="flex min-h-screen flex-col">
      <Header toggle={theme.toggle} />
      {/*
       * Required, because `suspend` above means the hooks can suspend.
       *
       * With no boundary between a suspending component and the root, React has
       * nowhere to show a fallback and the whole tree stops updating — which
       * looks like the Studio failing to load. TanStack Start gives you no
       * boundary of its own, so this is the app's job.
       */}
      <Suspense fallback={<main className="flex-1" />}>
        <Outlet />
      </Suspense>
      <Footer />
      <TanStackDevtools
        config={{ position: "bottom-left" }}
        plugins={[
          { name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> },
        ]}
      />
    </ThemeRoot>
  );
}
