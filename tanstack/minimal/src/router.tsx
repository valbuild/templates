// First, before the router and any route: Val's edit tags become
// `data-val-path` attributes from the very first component. Without it,
// under `vite dev` the components that load before Val are not
// click-to-edit, and Val's leak warning names their text.
import "@valbuild/tanstack/autotag";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });
}
