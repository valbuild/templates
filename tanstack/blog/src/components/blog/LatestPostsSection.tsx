import { Section } from "../base/Section";
import { SectionHeader } from "../base/SectionHeader";
import { Stack } from "../base/Stack";
import { Grid } from "../base/Grid";
import { TextLink } from "../typography/TextLink";
import { useVal } from "../../val/val.hooks";
import postsVal from "../../routes/_site.blog.$slug.val";
import type { LatestPostsSectionSchema } from "./latestPostsSection.val";
import { PostCard } from "./PostCard";
import { newestFirst } from "./posts";

export function LatestPostsSection({
  eyebrow,
  title,
  intro,
  count,
  surface,
}: LatestPostsSectionSchema) {
  const posts = newestFirst(useVal(postsVal)).slice(0, count);
  return (
    <Section surface={surface}>
      <Stack gap="lg">
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
        <Grid columns={3}>
          {posts.map(({ url, post }) => (
            <PostCard key={url} url={url} post={post} />
          ))}
        </Grid>
        <TextLink href="/blog" className="self-start">
          All posts →
        </TextLink>
      </Stack>
    </Section>
  );
}
