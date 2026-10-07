import { modules } from "@valbuild/next";
import { config } from "./val.config";

export default modules(config, [
  // Every module has to be listed here: one that is not does not exist as far
  // as Val Studio is concerned.
  { def: () => import("./src/content/home.val") },
]);
