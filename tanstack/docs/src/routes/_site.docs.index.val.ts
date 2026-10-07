import { s, c, tanstackRouter } from "../../val.config";
import { metaPreview, metaSchema } from "../shared/meta.val";

/*
 * The content of `_site.docs.index.tsx`: the words above the table of
 * contents at /docs. The contents themselves are every docs page, in order.
 */
export default c.define(
  "/src/routes/_site.docs.index.val.ts",
  s.router(
    tanstackRouter,
    s
      .object({
        meta: metaSchema,
        title: s.string().minLength(1).maxLength(120),
        intro: s.string().multiline().maxLength(400).nullable(),
      })
      .preview(({ val }) => metaPreview(val.meta)),
  ),
  {
    "/docs": {
      meta: {
        title: "Documentation",
        description: "Everything you need to know, in the order to read it.",
      },
      title: "Documentation",
      intro: "Everything you need to know, in the order to read it.",
    },
  },
);
