import { createFileRoute } from "@tanstack/react-router";
import { Styleguide } from "../styleguide/Styleguide";

/**
 * Every typography style, atom and base component, drawn with the site's own
 * theme from `theme.val.ts`.
 *
 * Open it next to the theme in Val Studio: a change to the preset, a colour or
 * the button shape shows up across every component at once. Not linked from
 * the site, and not indexed; delete it if you do not want it deployed.
 */
export const Route = createFileRoute("/_site/styleguide")({
  head: () => ({
    meta: [{ title: "Style guide" }, { name: "robots", content: "noindex" }],
  }),
  component: StyleguidePage,
});

function StyleguidePage() {
  return (
    <main>
      <Styleguide />
    </main>
  );
}
