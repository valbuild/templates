import { s, c } from "../../val.config";

/**
 * Custom fonts for the theme (`typography.heading` / `typography.body` in
 * `src/theme/theme.val.ts`). Empty until someone uploads one: the template's
 * own fonts ship as packages and need no upload.
 *
 * `.woff2` only: every current browser reads it, and it is the smallest.
 */
export default c.define(
  "/src/media/fonts.val.ts",
  s.fileset({
    dir: "/public/val/fonts",
    accept: "font/woff2",
  }),
  {},
);
