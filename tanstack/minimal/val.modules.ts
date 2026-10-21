import { modules } from "@valbuild/tanstack";
import { config } from "./val.config";

export default modules(config, [
  // Every module has to be listed here: one that is not does not exist as far
  // as Val Studio is concerned.
  //
  // The project's settings: one per project, at the root of the content tree.
  { def: () => import("./settings.val") },
  { def: () => import("./src/content/home.val") },
]);
