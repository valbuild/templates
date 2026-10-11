import { createValImageTools, type ValImageProcessor } from "@valbuild/mcp";
import { sharpImageProcessor } from "@valbuild/mcp/sharp";

/**
 * Letting an agent upload images.
 *
 * In its own file because it is the one part of the MCP endpoint with a
 * dependency of its own: reading the dimensions out of a JPEG and converting it
 * to WebP needs an image library, and `sharp` ships a compiled binary per
 * platform. Val does not bundle one, so a project decides for itself — which is
 * also what `npm create @valbuild` is asking when it offers image uploads.
 *
 * To turn this off: replace the body of this file with
 *
 * ```ts
 * import type { ValToolImpl } from "@valbuild/mcp";
 * export const valImageTools: ValToolImpl[] = [];
 * ```
 *
 * and remove `sharp` from package.json. Everything else keeps working — an
 * agent can still read, validate and edit content, it just cannot add an image.
 */

/**
 * `sharp` is loaded the first time an image is uploaded, not when the server
 * starts. A host that cannot run its binary — an edge runtime, Val's own
 * hosting among them — then still serves the site and the rest of MCP, and
 * only an image upload fails, with the reason. Imported at the top, it takes
 * the whole server down with it on such a host.
 */
let processor: Promise<ValImageProcessor> | undefined;
const loadProcessor = () =>
  (processor ??= import("sharp").then((sharp) =>
    sharpImageProcessor(sharp.default),
  ));

export const valImageTools = createValImageTools({
  read: async (bytes) => (await loadProcessor()).read(bytes),
  encode: async (bytes, request) =>
    (await loadProcessor()).encode(bytes, request),
});
