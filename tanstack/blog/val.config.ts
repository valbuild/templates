import { initVal } from "@valbuild/tanstack";

const { s, c, val, config, tanstackRouter } = initVal({
  // How Val Studio looks for an editor who has not chosen. /val paints the
  // same dark ground while it loads, in `src/routes/val/route.tsx`: change both together.
  defaultTheme: "dark",
});

export type { t } from "@valbuild/tanstack";
export { s, c, val, config, tanstackRouter };
