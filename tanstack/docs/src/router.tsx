// First, before the router and any route: Val's edit tags become
// `data-val-path` attributes from the very first component. Without it,
// under `vite dev` the components that load before Val are not
// click-to-edit, and Val's leak warning names their text.
import "@valbuild/tanstack/autotag";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "./components/NotFound";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    /*
     * A `notFound()` thrown from a LOADER lands here.
     *
     * A page whose content entry does not exist is ordinary with a CMS, so it
     * needs a real 404 rather than TanStack's bare fallback and the
     * "notFoundError was encountered on the route with ID __root__" warning
     * that comes with it. Note that a component cannot throw `notFound()` to
     * reach this — see src/routes/_site.index.tsx.
     */
    defaultNotFoundComponent: NotFound,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
