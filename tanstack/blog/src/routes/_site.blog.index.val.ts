import { s, c, tanstackRouter } from "../../val.config";
import { metaPreview, metaSchema } from "../shared/meta.val";

/*
 * The content of `_site.blog.index.tsx`: the words above the list of posts.
 * The list itself is not content — it is every post, newest first.
 */
const blogIndexSchema = s.object({
  meta: metaSchema,
  title: s.string().minLength(1).maxLength(120),
  intro: s.string().multiline().maxLength(400).nullable(),
});

export default c.define(
  "/src/routes/_site.blog.index.val.ts",
  s.router(
    tanstackRouter,
    blogIndexSchema.preview(({ val }) => metaPreview(val.meta)),
  ),
  {
    "/blog": {
      meta: {
        title: "Blog",
        description: "Everything we have written, newest first.",
      },
      title: "Blog",
      intro: "Everything we have written, newest first.",
    },
  },
);
