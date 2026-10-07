import { Outlet, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Suspense } from "react";
import { ValModulesClient, ValProvider } from "@valbuild/tanstack";
import { config } from "../../val.config";
import valModules from "../../val.modules";
import { fetchValDraft } from "../val/val.server";

/**
 * The draft this request renders, when an editor is previewing; `null` for
 * everyone else, after one cookie lookup.
 *
 * Through `createServerFn`, because a route `loader` runs in the browser too,
 * and `val.server` (which reads files with Node's `fs`) must not end up there.
 * `createServerFn` is compiled away on the client.
 */
const getValDraft = createServerFn().handler(() => fetchValDraft());

/**
 * The site's layout — everything except Val Studio.
 *
 * Pathless (`_site`), so it adds no URL segment: `_site.index.tsx` is `/`, and
 * `_site.about.tsx` would be `/about`. Put every page of your site under here;
 * keeping it out of `__root` is what keeps the Val overlay off `/val`.
 */
export const Route = createFileRoute("/_site")({
  /*
   * On the server only. The draft is for the render that has no other way to
   * get it -- the first one, and the browser's hydration of it, which reuses
   * this loader's data. After that the Val overlay keeps the page up to date.
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
     * `suspend` lets a page that exists only in an unpublished draft render
     * instead of 404ing; visitors without the Val Enable cookie pay nothing
     * for it. `draft` is what the server rendered with, so the browser's first
     * render agrees with it.
     */
    <ValProvider config={config} suspend draft={draft}>
      {/* Hands the Studio your schemas. Needed here AND on the /val route. */}
      <ValModulesClient modules={valModules} />
      {/*
       * Required, because `suspend` above means the hooks can suspend. With no
       * boundary between a suspending component and the root, the whole tree
       * stops updating — which looks like the Studio failing to load.
       */}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </ValProvider>
  );
}
