import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "../components/NotFound";
import { Container } from "../components/base/Container";
import { Grid } from "../components/base/Grid";
import { Stack } from "../components/base/Stack";
import { Heading } from "../components/typography/Heading";
import { Text } from "../components/typography/Text";
import { PostCard } from "../components/blog/PostCard";
import { newestFirst } from "../components/blog/posts";
import { useVal, useValRoute } from "../val/val.hooks";
import pageVal from "./_site.blog.index.val";
import postsVal from "./_site.blog.$slug.val";

export const Route = createFileRoute("/_site/blog/")({
  head: () => ({
    meta: [{ title: "Blog" }],
    links: [
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "RSS",
        href: "/rss.xml",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const page = useValRoute(pageVal, {});
  const posts = newestFirst(useVal(postsVal));
  if (!page) {
    return <NotFound />;
  }
  return (
    <main className="py-section">
      <Container>
        <Stack gap="lg">
          <Stack gap="sm" className="max-w-2xl">
            <Heading level={1} size="xl">
              {page.title}
            </Heading>
            {page.intro && (
              <Text size="lg" tone="muted">
                {page.intro}
              </Text>
            )}
          </Stack>
          {posts.length === 0 ? (
            <Text tone="muted">
              No posts yet. Add one in Val Studio, with New page.
            </Text>
          ) : (
            <Grid columns={3}>
              {posts.map(({ url, post }) => (
                <PostCard key={url} url={url} post={post} />
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </main>
  );
}
