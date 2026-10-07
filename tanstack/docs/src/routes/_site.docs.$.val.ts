import { s, c, tanstackRouter } from "../../val.config";
import { docPagePreview, docPageSchema } from "../components/docs/doc.val";
import { docsLinkProblems } from "../components/docs/docsOrder.val";

/*
 * Every docs page, one entry per URL: the content of `_site.docs.$.tsx`.
 *
 * `$` is a splat, so a key can be as deep as the docs need —
 * `/docs/guides/deploy/vercel` is as good a key as `/docs/introduction`. The
 * sidebar is not stored anywhere: it is worked out from each page's `group` and
 * `next` (see `docsOrder.val.ts`), and this module's validation says when those
 * links do not make one clear order.
 */
export default c.define(
  "/src/routes/_site.docs.$.val.ts",
  s
    .router(tanstackRouter, docPageSchema.preview(docPagePreview))
    .validate((pages) => {
      const problems = docsLinkProblems(
        Object.entries(pages).map(([url, page]) => ({
          url,
          group: page.group,
          next: page.next,
        })),
      );
      return problems.length === 0 ? false : problems.join(" ");
    }),
  {
    "/docs/introduction": {
      title: "Introduction",
      description: "What these docs are, and how they are put together.",
      group: "Getting started",
      next: "/docs/getting-started/installation",
      blocks: [
        {
          type: "text",
          text: [
            {
              tag: "p",
              children: [
                "These docs are content in the repository, edited in Val Studio. Every page is an entry in one module, and the sidebar on the left is worked out from the pages themselves.",
              ],
            },
            { tag: "h2", children: ["How the sidebar is made"] },
            {
              tag: "ul",
              children: [
                {
                  tag: "li",
                  children: [
                    {
                      tag: "p",
                      children: [
                        "A page's ",
                        { tag: "span", styles: ["bold"], children: ["group"] },
                        " is the heading it is listed under.",
                      ],
                    },
                  ],
                },
                {
                  tag: "li",
                  children: [
                    {
                      tag: "p",
                      children: [
                        "A page's ",
                        { tag: "span", styles: ["bold"], children: ["next"] },
                        " is the page after it, at the bottom of the page and in the sidebar.",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Start here",
          text: [
            {
              tag: "p",
              children: [
                "Open Val Studio and change this page. What you type shows up here as you type it.",
              ],
            },
          ],
        },
      ],
    },
    "/docs/getting-started/installation": {
      title: "Installation",
      description: "Get the site running on your own machine.",
      group: "Getting started",
      next: "/docs/getting-started/first-page",
      blocks: [
        {
          type: "text",
          text: [
            {
              tag: "p",
              children: [
                "Install the dependencies and start the development server:",
              ],
            },
          ],
        },
        {
          type: "code",
          filename: "Terminal",
          code: "pnpm install\npnpm dev",
        },
        {
          type: "text",
          text: [
            {
              tag: "p",
              children: [
                "The site is at http://localhost:3000, and Val Studio at http://localhost:3000/val.",
              ],
            },
          ],
        },
      ],
    },
    "/docs/getting-started/first-page": {
      title: "Your first page",
      description: "Add a page, put it in a group, and place it in the order.",
      group: "Getting started",
      next: "/docs/writing/blocks",
      blocks: [
        {
          type: "text",
          text: [
            {
              tag: "ol",
              children: [
                {
                  tag: "li",
                  children: [
                    {
                      tag: "p",
                      children: [
                        "In Val Studio, open Pages and choose New page under /docs.",
                      ],
                    },
                  ],
                },
                {
                  tag: "li",
                  children: [
                    {
                      tag: "p",
                      children: [
                        "Give it a group. A new group name makes a new heading in the sidebar.",
                      ],
                    },
                  ],
                },
                {
                  tag: "li",
                  children: [
                    {
                      tag: "p",
                      children: [
                        "To place it after another page, set that page's Next to the new one, and the new page's Next to whatever came after.",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "callout",
          tone: "note",
          title: null,
          text: [
            {
              tag: "p",
              children: [
                "A page with no links to or from it is listed after the linked pages, in URL order, so it is never lost.",
              ],
            },
          ],
        },
      ],
    },
    "/docs/writing/blocks": {
      title: "Text, code and callouts",
      description: "The three kinds of block a page is made of.",
      group: "Writing docs",
      next: null,
      blocks: [
        {
          type: "text",
          text: [
            {
              tag: "p",
              children: [
                "A page is a list of blocks. Text holds headings, lists, links and images. Code holds code, with an optional file name and a copy button.",
              ],
            },
          ],
        },
        {
          type: "code",
          filename: "src/routes/_site.docs.$.val.ts",
          code: '"/docs/my-page": {\n  title: "My page",\n  group: "Guides",\n  next: null,\n  blocks: [],\n},',
        },
        {
          type: "callout",
          tone: "warning",
          title: "Links make the order",
          text: [
            {
              tag: "p",
              children: [
                "If two pages name the same Next page, or the links go round in a circle, the Studio says so. The site keeps working, but the order is not what anyone meant.",
              ],
            },
          ],
        },
      ],
    },
  },
);
