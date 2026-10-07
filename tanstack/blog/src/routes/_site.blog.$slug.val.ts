import { s, c, tanstackRouter } from "../../val.config";
import { postPreview, postSchema } from "../components/blog/post.val";

/*
 * The posts, one entry per URL: the content of `_site.blog.$slug.tsx`.
 *
 * A route module, so the Studio's "New page" asks for a URL under /blog/, and
 * the Pages panel lists every post. `$slug` is the post's own part of the URL.
 */
export default c.define(
  "/src/routes/_site.blog.$slug.val.ts",
  s.router(tanstackRouter, postSchema.preview(postPreview)),
  {
    "/blog/hello-world": {
      title: "Hello, world",
      description:
        "The first post on a new blog: what is here, where it lives, and how to change it.",
      published: "2026-10-01",
      author: "ada",
      cover: { path: "/public/val/images/coast.svg" },
      body: [
        {
          tag: "p",
          children: [
            "Every post on this blog is content in the repository, in ",
            {
              tag: "a",
              href: "https://val.build/docs",
              children: ["one Val module"],
            },
            ". Open Val Studio to change this one, or add a post with ",
            { tag: "span", styles: ["bold"], children: ["New page"] },
            ".",
          ],
        },
        { tag: "h2", children: ["What a post is made of"] },
        {
          tag: "ul",
          children: [
            {
              tag: "li",
              children: [
                { tag: "p", children: ["A title and a short description"] },
              ],
            },
            {
              tag: "li",
              children: [
                {
                  tag: "p",
                  children: [
                    "A date, which decides the order posts are listed in",
                  ],
                },
              ],
            },
            {
              tag: "li",
              children: [
                {
                  tag: "p",
                  children: ["An author, picked from the list of authors"],
                },
              ],
            },
            {
              tag: "li",
              children: [
                {
                  tag: "p",
                  children: ["A cover image, and a body that can hold more"],
                },
              ],
            },
          ],
        },
        {
          tag: "p",
          children: [
            {
              tag: "img",
              src: { path: "/public/val/images/forest.svg" },
            },
          ],
        },
        {
          tag: "p",
          children: [
            "Images in a post come from the same library as every other image on the site, so an image is uploaded once however many posts use it.",
          ],
        },
      ],
    },
    "/blog/writing-in-val": {
      title: "Writing in Val Studio",
      description:
        "How a post is written, previewed and published, without leaving the page it will appear on.",
      published: "2026-10-05",
      author: "linus",
      cover: { path: "/public/val/images/desert.svg" },
      body: [
        {
          tag: "p",
          children: [
            "Open a post on the site and click any text to change it. What you type shows up on the page as you type it, and nothing is published until you say so.",
          ],
        },
        { tag: "h2", children: ["Drafts"] },
        {
          tag: "p",
          children: [
            "An edit is a draft until it is published. A post that exists only as a draft can still be opened at its URL by anyone with Val Studio open, so it can be read in place before anyone else sees it.",
          ],
        },
        { tag: "h2", children: ["The feed"] },
        {
          tag: "p",
          children: [
            "Readers can follow the blog at ",
            { tag: "a", href: "/rss.xml", children: ["/rss.xml"] },
            ", which lists every published post, newest first.",
          ],
        },
      ],
    },
  },
);
