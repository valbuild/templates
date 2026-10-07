import { modules } from "@valbuild/next";
import { config } from "./val.config";

export default modules(config, [
  // Every module has to be listed here: one that is not does not exist as far
  // as Val Studio is concerned.
  //
  // A page's content sits beside the page it serves, and its keys are the
  // URLs that page serves.
  { def: () => import("./src/theme/theme.val") },
  // The media libraries: every image, video and file on the site.
  { def: () => import("./src/media/images.val") },
  { def: () => import("./src/media/videos.val") },
  { def: () => import("./src/media/files.val") },
  { def: () => import("./src/media/icons.val") },
  { def: () => import("./src/media/fonts.val") },
  { def: () => import("./src/app/(main)/page.val") },
  { def: () => import("./src/app/(main)/products/[sku]/page.val") },
]);
