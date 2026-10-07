import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { val } from "../../val.config";
import { NotFound } from "../components/NotFound";
import { Stack } from "../components/base/Stack";
import { Eyebrow } from "../components/typography/Eyebrow";
import { Heading } from "../components/typography/Heading";
import { Text } from "../components/typography/Text";
import { DocBlocks } from "../components/docs/DocBlocks";
import { DocsPager } from "../components/docs/DocsPager";
import { useDocs } from "../components/docs/useDocs";
import { useValRoute } from "../val/val.hooks";
import { fetchValRoute } from "../val/val.server";
import docsVal from "./_site.docs.$.val";

/**
 * The page's title and description for `<head>`, read on the server — through
 * `createServerFn`, because a route `loader` runs in the browser too and
 * `val.server` must not end up there.
 */
const getMeta = createServerFn()
  .validator((params: { _splat?: string }) => params)
  .handler(async ({ data }) => {
    const page = await fetchValRoute(docsVal, data);
    if (!page) {
      return null;
    }
    return {
      title: val.raw(page.title),
      description: page.description === null ? null : val.raw(page.description),
    };
  });

export const Route = createFileRoute("/_site/docs/$")({
  loader: async ({ params }) => {
    const meta = await getMeta({ data: params });
    if (!meta) {
      throw notFound();
    }
    return meta;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      ...(loaderData?.description
        ? [{ name: "description", content: loaderData.description }]
        : []),
    ],
  }),
  component: DocPage,
});

function DocPage() {
  const page = useValRoute(docsVal, Route.useParams());
  const { order, byUrl } = useDocs();
  const pathname = Route.useMatch({ select: (match) => match.pathname });
  if (!page) {
    // Returned, not thrown: see `_site.index.tsx`.
    return <NotFound />;
  }
  const neighbour = (url: string | undefined) => {
    const target = url === undefined ? undefined : byUrl.get(url);
    return url !== undefined && target ? { url, page: target } : null;
  };
  return (
    <article className="min-w-0 max-w-3xl">
      <Stack gap="sm" className="mb-8">
        <Eyebrow>{page.group}</Eyebrow>
        <Heading level={1} size="xl">
          {page.title}
        </Heading>
        {page.description && (
          <Text size="lg" tone="muted">
            {page.description}
          </Text>
        )}
      </Stack>
      <DocBlocks blocks={page.blocks} />
      <DocsPager
        previous={neighbour(order.previous.get(pathname))}
        next={neighbour(order.next.get(pathname))}
      />
    </article>
  );
}
