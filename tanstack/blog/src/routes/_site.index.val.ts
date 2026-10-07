import { s, c, tanstackRouter } from "../../val.config";
import {
  homeSection,
  homeSectionPreview,
} from "../components/blog/homeSection.val";
import { metaPreview, metaSchema } from "../shared/meta.val";

const mainPageSchema = s.object({
  meta: metaSchema,
  // Every shared section, and Latest Posts. See `homeSection.val.ts`.
  // The preview lives on the SECTION, the value being previewed - not on the
  // array around it, which would preview the whole list as one value.
  sections: s.array(homeSection.preview(homeSectionPreview)),
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
          eyebrow: "A blog on Val + TanStack Start",
          title: "Notes from the people who build this",
          intro:
            "Every post here lives in the repository, and is written, previewed and published in Val Studio, on the page it appears on.",
          buttons: [
            {
              type: "internal",
              label: "Read the blog",
              href: "/blog",
              variant: "primary",
            },
            {
              type: "external",
              label: "Open Val Studio",
              href: "/val",
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
          type: "latest-posts",
          eyebrow: "From the blog",
          title: "Latest posts",
          intro: null,
          count: 3,
          surface: "muted",
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
          title: "Follow along",
          text: [
            {
              tag: "p",
              children: [
                "Every post, newest first, in any feed reader: subscribe to the RSS feed.",
              ],
            },
          ],
          buttons: [
            {
              type: "external",
              href: "/rss.xml",
              label: "Subscribe to the feed",
              variant: "primary",
            },
            {
              type: "internal",
              href: "/blog",
              label: "Read the blog",
              variant: "secondary",
            },
          ],
        },
      ],
    },
  },
);
