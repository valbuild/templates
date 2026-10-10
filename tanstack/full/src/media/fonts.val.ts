import { s, c } from "../../val.config";

/**
 * Custom fonts for the theme (`typography.heading` / `typography.body` in
 * `src/theme/theme.val.ts`). Empty until someone uploads one: the template's
 * own fonts ship as packages and need no upload.
 *
 * An `s.fontset()`, so the Studio shows each file as type rather than as a
 * file name, and a field picks from it with `s.font(fontsVal)`.
 *
 * `.woff2` only: every current browser reads it, it is the smallest, and it is
 * the format `themeCss` declares in the `@font-face` it writes.
 */
export default c.define(
  "/src/media/fonts.val.ts",
  s.fontset({
    dir: "/public/val/fonts",
    accept: "font/woff2",
  }),
  {},
);
