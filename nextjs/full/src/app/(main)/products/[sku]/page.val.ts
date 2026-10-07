import { s, c, nextAppRouter } from "../../../../../val.config";
import { sectionListPreview } from "../../../../components/sections/anySection.val";
import { imageTextSection } from "../../../../components/sections/imageTextSection.val";
import { metaPreview, metaSchema } from "../../../../shared/meta.val";

const productPageSchema = s.object({
  meta: metaSchema,
  sections: s.array(
    s
      .discriminatedUnion(
        "type",
        // Add other sections here
        imageTextSection,
      )
      // The preview lives on the SECTION, the value being previewed - not on
      // the array around it, which would preview the whole list as one value.
      .preview(sectionListPreview),
  ),
});

/*
 * The content of `src/app/(main)/products/[sku]/page.tsx`.
 *
 * `[sku]` is a route parameter, so this module holds one entry per product and
 * the keys are the URLs.
 */
export default c.define(
  "/src/app/(main)/products/[sku]/page.val.ts",
  s.router(
    nextAppRouter,
    // The preview lives on the PAGE (the value being previewed), not on the
    // router: the router's rows, search and references all read it from there.
    productPageSchema.preview(({ val }) => {
      return metaPreview(val.meta);
    }),
  ),
  {
    "/products/product-1": {
      meta: {
        title: "Product 1",
        description:
          "This page is built with Val Build - the lightweight CMS where content is code.",
      },
      sections: [
        {
          type: "image-text",
          surface: "default",
          title: "Product 1",
          text: [
            {
              tag: "p",
              children: [
                "This is a product page built with Val Build - the lightweight CMS where content is code.",
              ],
            },
          ],
          image: null,
          imageSide: "left",
        },
      ],
    },
  },
);
