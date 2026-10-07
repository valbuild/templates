import { s, c } from "../../val.config";

/**
 * Icons: single-colour SVGs. They are drawn in the colour of the text around
 * them, so one icon works on every background and in dark mode. See `Icon`.
 */
export default c.define(
  "/src/media/icons.val.ts",
  s.imageset({
    dir: "/public/val/icons",
    accept: "image/svg+xml",
  }),
  {
    "/public/val/icons/spark.svg": {
      width: 24,
      height: 24,
      mimeType: "image/svg+xml",
      alt: null,
    },
    "/public/val/icons/leaf.svg": {
      width: 24,
      height: 24,
      mimeType: "image/svg+xml",
      alt: null,
    },
    "/public/val/icons/bolt.svg": {
      width: 24,
      height: 24,
      mimeType: "image/svg+xml",
      alt: null,
    },
  },
);
