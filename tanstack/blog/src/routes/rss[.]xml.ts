import { createFileRoute } from "@tanstack/react-router";
import { val } from "../../val.config";
import { newestFirst } from "../components/blog/posts";
import { fetchVal } from "../val/val.server";
import authorsVal from "../content/authors.val";
import blogVal from "./_site.blog.index.val";
import postsVal from "./_site.blog.$slug.val";

/**
 * The blog as an RSS 2.0 feed, at `/rss.xml`: every post, newest first.
 *
 * A server route, so it reads content with `val.server` like any server code.
 * That reads what the requester would see on the site: published posts for a
 * feed reader, and an editor's drafts for an editor who has preview on —
 * which is also why the response is not marked cacheable by a shared cache,
 * where an editor's draft feed could be kept and handed to everyone. Every
 * string is `val.raw`, because the invisible edit tags have no business in
 * XML.
 *
 * The site's address is taken from the request, so the feed is right on
 * localhost, on a preview deployment and in production without a setting.
 */
export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const [posts, authors, blogPages] = await Promise.all([
          fetchVal(postsVal),
          fetchVal(authorsVal),
          fetchVal(blogVal),
        ]);
        const blog = blogPages["/blog"];
        const items = newestFirst(posts).map(({ url, post }) => {
          const author = authors[val.raw(post.author)];
          return [
            "<item>",
            `<title>${xml(val.raw(post.title))}</title>`,
            `<link>${xml(origin + url)}</link>`,
            `<guid isPermaLink="true">${xml(origin + url)}</guid>`,
            `<description>${xml(val.raw(post.description))}</description>`,
            `<pubDate>${new Date(`${val.raw(post.published)}T00:00:00Z`).toUTCString()}</pubDate>`,
            author
              ? `<dc:creator>${xml(val.raw(author.name))}</dc:creator>`
              : "",
            "</item>",
          ].join("");
        });
        const body = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">`,
          "<channel>",
          `<title>${xml(blog ? val.raw(blog.meta.title) : "Blog")}</title>`,
          `<link>${xml(`${origin}/blog`)}</link>`,
          `<description>${xml(blog ? val.raw(blog.meta.description) : "")}</description>`,
          `<atom:link href="${xml(`${origin}/rss.xml`)}" rel="self" type="application/rss+xml"/>`,
          ...items,
          "</channel>",
          "</rss>",
        ].join("\n");
        return new Response(body, {
          headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
        });
      },
    },
  },
});

function xml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
