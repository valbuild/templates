import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { val } from "../../val.config";
import { NotFound } from "../components/NotFound";
import { Container } from "../components/base/Container";
import { Stack } from "../components/base/Stack";
import { Media } from "../components/atoms/Media";
import { Heading } from "../components/typography/Heading";
import { Text } from "../components/typography/Text";
import { TextLink } from "../components/typography/TextLink";
import { Byline } from "../components/blog/Byline";
import { PostBody } from "../components/blog/PostBody";
import { useVal, useValRoute } from "../val/val.hooks";
import { fetchValRoute } from "../val/val.server";
import authorsVal from "../content/authors.val";
import postsVal from "./_site.blog.$slug.val";

/**
 * The post's title and description for `<head>`, read on the server.
 *
 * Through `createServerFn` because `head` runs before the component does, and a
 * route `loader` runs in the browser too: importing `val.server` into one would
 * put Node's `fs` in the client bundle.
 */
const getMeta = createServerFn()
  .validator((params: { slug: string }) => params)
  .handler(async ({ data }) => {
    const post = await fetchValRoute(postsVal, data);
    if (!post) {
      return null;
    }
    // `val.raw`: these end up in `<title>` and `<meta>`, which a browser reads
    // rather than renders, so the invisible edit tag would only be noise.
    return {
      title: val.raw(post.title),
      description: val.raw(post.description),
      published: val.raw(post.published),
    };
  });

export const Route = createFileRoute("/_site/blog/$slug")({
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
      { name: "description", content: loaderData?.description },
      { property: "og:type", content: "article" },
      { property: "og:title", content: loaderData?.title },
      { property: "og:description", content: loaderData?.description },
      {
        property: "article:published_time",
        content: loaderData?.published,
      },
    ],
  }),
  component: PostPage,
});

function PostPage() {
  const post = useValRoute(postsVal, Route.useParams());
  const authors = useVal(authorsVal);
  if (!post) {
    // Returned, not thrown: see `_site.index.tsx`.
    return <NotFound />;
  }
  const author = authors[val.raw(post.author)] ?? null;
  return (
    <main className="py-section">
      <Container>
        <article className="mx-auto max-w-2xl">
          <Stack gap="md">
            <TextLink href="/blog" className="self-start">
              ← All posts
            </TextLink>
            <Heading level={1} size="xl">
              {post.title}
            </Heading>
            <Text size="lg" tone="muted">
              {post.description}
            </Text>
            <Byline author={author} published={post.published} />
          </Stack>
          {post.cover && (
            <Media
              media={{ type: "image", image: post.cover }}
              aspect="wide"
              className="my-10"
            />
          )}
          <PostBody value={post.body} className={post.cover ? "" : "mt-10"} />
          {author?.bio && (
            <div className="mt-12 border-t border-border pt-6">
              <Text size="sm" className="font-semibold">
                About {author.name}
              </Text>
              <Text size="sm" tone="muted">
                {author.bio}
              </Text>
            </div>
          )}
        </article>
      </Container>
    </main>
  );
}
