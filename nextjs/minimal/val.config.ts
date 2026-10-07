import { initVal } from "@valbuild/next";

const { s, c, val, config, nextAppRouter } = initVal({
  // How Val Studio looks for an editor who has not chosen. /val paints the
  // same dark ground while it loads, in `src/app/(val)/layout.tsx`: change both together.
  defaultTheme: "dark",
});

export type { t } from "@valbuild/next";
export { s, c, val, config, nextAppRouter };
