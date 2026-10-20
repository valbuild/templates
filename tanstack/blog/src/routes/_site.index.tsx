import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { val } from "../../val.config";
import { NotFound } from "../components/NotFound";
import { HomeSection } from "../components/blog/HomeSection";
import { useValRoute } from "../val/val.hooks";
import { fetchValRoute } from "../val/val.server";
import pageVal from "./_site.index.val";

/**
 * The page's title and meta description, read on the server.
 *
 * `head` runs before the component, so this is a server read, and through
 * `createServerFn` for the reason `val.server.ts` gives: a route loader runs
 * in the browser too. Without it the page has no meta description, which
 * search engines show under the link and Lighthouse's SEO audit fails.
 */
const getMeta = createServerFn().handler(async () => {
  const page = await fetchValRoute(pageVal, {});
  if (!page) {
    return null;
  }
  // `val.raw`: this ends up in `<title>` and `<meta>`, where the edit tags
  // that make a string click-to-editable are noise.
  return {
    title: val.raw(page.meta.title),
    description: val.raw(page.meta.description),
  };
});

export const Route = createFileRoute("/_site/")({
  loader: () => getMeta(),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? "Home" },
      ...(loaderData?.description
        ? [{ name: "description", content: loaderData.description }]
        : []),
    ],
    links: [
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "RSS",
        href: "/rss.xml",
      },
    ],
  }),
  component: Home,
});

function Home() {
  /*
   * Read in the component, which is the everyday way.
   *
   * The hook resolves the published content when the server renders this, and
   * whatever the editor currently holds in a browser with Val Studio open — so
   * an edit shows up as it is typed, and every string on the page is
   * click-to-editable. Nothing server-only is imported here.
   */
  const pageContent = useValRoute(pageVal, {});
  if (!pageContent) {
    /*
     * Returned, not thrown.
     *
     * `notFound()` is for a loader. Thrown from a component it escapes into the
     * error boundary instead — the right page still renders, but every miss
     * logs `Error in renderToReadableStream` during server rendering. Reading
     * content in the component is Val's normal path, so a page with no entry
     * has to be an ordinary render rather than an exception.
     */
    return <NotFound />;
  }
  return (
    <main>
      {pageContent.sections.map((section, index) => (
        <HomeSection
          key={`${section.type}-${index}`}
          section={section}
          priority={index === 0}
        />
      ))}
    </main>
  );
}
