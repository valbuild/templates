import { s, c } from "../../val.config";

/**
 * Files people download: price lists, brochures, guides. A link picks one with
 * `s.file(filesVal)`.
 */
export default c.define(
  "/src/media/files.val.ts",
  s.fileset({
    dir: "/public/val/files",
    accept: "application/pdf,text/plain,text/csv,application/zip",
  }),
  {
    "/public/val/files/getting-started.pdf": {
      mimeType: "application/pdf",
    },
  },
);
