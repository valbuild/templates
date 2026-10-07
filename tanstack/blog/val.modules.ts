import { modules } from "@valbuild/tanstack";
import { config } from "./val.config";

export default modules(config, [
  // Add your modules here.
  //
  // A module that holds a page's content is named after the route file it sits
  // beside, and its keys are the URLs that route serves.
  { def: () => import("./src/theme/theme.val") },
  // The media libraries: every image, video and file on the site.
  { def: () => import("./src/media/images.val") },
  { def: () => import("./src/media/videos.val") },
  { def: () => import("./src/media/files.val") },
  { def: () => import("./src/media/icons.val") },
  { def: () => import("./src/media/fonts.val") },
  { def: () => import("./src/content/authors.val") },
  { def: () => import("./src/routes/_site.index.val") },
  { def: () => import("./src/routes/_site.blog.index.val") },
  { def: () => import("./src/routes/_site.blog.$slug.val") },
]);
