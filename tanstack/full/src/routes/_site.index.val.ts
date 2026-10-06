import { s, c, tanstackRouter } from "../../val.config";
import {
  anySection,
  sectionListPreview,
} from "../components/sections/anySection.val";
import { metaPreview, metaSchema } from "../shared/meta.val";

const mainPageSchema = s.object({
  meta: metaSchema,
  // Every section type. A page that should offer fewer lists its own, as
  // `_site.products.$sku.val.ts` does.
  // The preview lives on the SECTION, the value being previewed - not on the
  // array around it, which would preview the whole list as one value.
  sections: s.array(anySection.preview(sectionListPreview)),
});

/*
 * The content of `src/routes/_site.index.tsx`.
 *
 * A route module is named after the route file it sits beside — the `.tsx`
 * becomes `.val.ts` — and its keys are the URLs that route serves. For the
 * index route that is just "/".
 */
export default c.define(
  "/src/routes/_site.index.val.ts",
  s.router(
    tanstackRouter,
    // The preview lives on the PAGE (the value being previewed), not on the
    // router: the router's rows, search and references all read it from there.
    mainPageSchema.preview(({ val }) => {
      return metaPreview(val.meta);
    }),
  ),
  {
    "/": {
      meta: {
        title: "Home",
        description:
          "This page is built with Val Build - the lightweight CMS where content is code.",
      },
      sections: [
        {
          type: "hero",
          eyebrow: "Val + TanStack Start",
          title: "Content as code, edited like a website",
          intro:
            "Everything on this page lives in your repository, and every word, image and colour can be changed in Val Studio without touching a line of it.",
          buttons: [
            {
              type: "external",
              label: "Open Val Studio",
              href: "/val",
              variant: "primary",
            },
            {
              type: "external",
              label: "Read the docs",
              href: "https://val.build/docs",
              variant: "secondary",
            },
          ],
          background: {
            type: "video",
            video: { path: "/public/val/videos/dusk.mp4" },
          },
          surface: "default",
        },
        {
          type: "card-grid",
          eyebrow: "Why Val",
          title: "A CMS that lives where your code does",
          intro: null,
          columns: "3",
          cards: [
            {
              image: { path: "/public/val/images/card-local.svg" },
              tag: "Local first",
              title: "Your content is in your repository",
              text: "Typed by schemas, reviewed in pull requests, and versioned with Git. No signup to start.",
              link: {
                type: "file",
                label: "Download the guide (PDF)",
                file: { path: "/public/val/files/getting-started.pdf" },
              },
            },
            {
              image: { path: "/public/val/images/card-visual.svg" },
              tag: "Visual editing",
              title: "Click the page to change it",
              text: "Editors change text and images on the page itself, and see the result before anyone else does.",
              link: {
                type: "external",
                label: "Open Val Studio",
                href: "/val",
              },
            },
            {
              image: { path: "/public/val/images/card-theme.svg" },
              tag: "Themeable",
              title: "The look is content too",
              text: "Pick a preset, then change colours, fonts and shapes in the Studio. Text stays readable whatever you choose.",
              link: {
                type: "external",
                label: "See the style guide",
                href: "/styleguide",
              },
            },
          ],
          surface: "default",
        },
        {
          type: "image-text",
          image: { path: "/public/val/images/coast.svg" },
          imageSide: "right",
          surface: "muted",
          title: "How Val works",
          text: [
            {
              tag: "p",
              children: [
                "Val runs in two modes: ",
                { tag: "span", styles: ["bold"], children: ["development"] },
                " when you run the site locally, and ",
                { tag: "span", styles: ["bold"], children: ["production"] },
                " when it is deployed. Both preview changes as drafts before they go live.",
              ],
            },
            {
              tag: "p",
              children: [
                "Locally, Val Studio at ",
                { tag: "span", styles: ["italic"], children: ["/val"] },
                " writes your changes straight into the content files, and you commit them like any other change. Deployed, editors publish from the Studio and Val makes the commit.",
              ],
            },
          ],
        },
        {
          type: "media-carousel",
          eyebrow: "Gallery",
          title: "Images from the Studio",
          intro:
            "Upload an image, set its focal point, and it stays in frame however the layout crops it.",
          slides: [
            {
              image: { path: "/public/val/images/forest.svg" },
              caption: "Morning, inland.",
            },
            {
              image: { path: "/public/val/images/desert.svg" },
              caption: "Afternoon in the dunes.",
            },
            {
              image: { path: "/public/val/images/night.svg" },
              caption: "Night over the ridge.",
            },
            {
              image: { path: "/public/val/images/coast.svg" },
              caption: "Back to the coast.",
            },
          ],
          surface: "default",
        },
        {
          type: "accordion",
          eyebrow: "Questions",
          title: "Before you start",
          intro: null,
          oneAtATime: true,
          items: [
            {
              question: "Do I need an account to try Val?",
              answer: [
                {
                  tag: "p",
                  children: [
                    "No. Val runs on your machine against the files in this repository. You only need an account when you deploy and want other people to edit.",
                  ],
                },
              ],
            },
            {
              question: "Where is the content stored?",
              answer: [
                {
                  tag: "p",
                  children: [
                    "In ",
                    { tag: "span", styles: ["italic"], children: [".val.ts"] },
                    " files next to the code that shows it. Publishing a change is a Git commit, so your content has the same history, review and rollback as your code.",
                  ],
                },
              ],
            },
            {
              question: "Can people who do not write code edit the site?",
              answer: [
                {
                  tag: "p",
                  children: [
                    "Yes. Val Studio is an editor for the whole site, and anything on a page can be clicked to edit it there.",
                  ],
                },
              ],
            },
            {
              question: "How do I change how the site looks?",
              answer: [
                {
                  tag: "p",
                  children: [
                    "Open the theme in Val Studio. Pick one of four presets, then override what you like: colours, fonts, button shape, spacing. The style guide at ",
                    {
                      tag: "span",
                      styles: ["italic"],
                      children: ["/styleguide"],
                    },
                    " shows every component in the current theme.",
                  ],
                },
              ],
            },
          ],
          surface: "default",
        },
        {
          type: "title-text",
          surface: "brand",
          title: "See a page with its own route",
          text: [
            {
              tag: "p",
              children: [
                "The product pages show how one route serves many pages, each with its own content. Delete them when you no longer need the example.",
              ],
            },
          ],
          buttons: [
            {
              type: "internal",
              href: "/products/product-1",
              label: "View an example product",
              variant: "primary",
            },
          ],
        },
      ],
    },
  },
);
