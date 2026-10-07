import { RouterLink } from "../../framework";
import { Card, CardBody } from "../base/Card";
import { Media } from "../atoms/Media";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";
import type { PostSchema } from "./post.val";
import { formatDate } from "./posts";

/**
 * A post in a list: its cover, date, title and description. The whole card is
 * the link, by way of the title's link stretched over it, so the card is one
 * stop for a keyboard and a screen reader rather than three.
 */
export function PostCard({ url, post }: { url: string; post: PostSchema }) {
  return (
    <Card className="relative">
      {post.cover && (
        <Media
          media={{ type: "image", image: post.cover }}
          aspect="wide"
          rounded={false}
        />
      )}
      <CardBody>
        <Text size="sm" tone="muted">
          <time dateTime={post.published}>{formatDate(post.published)}</time>
        </Text>
        <Heading level={3} size="xs">
          <RouterLink
            href={url}
            className="text-fg no-underline after:absolute after:inset-0 hover:underline"
          >
            {post.title}
          </RouterLink>
        </Heading>
        <Text size="sm" tone="muted">
          {post.description}
        </Text>
      </CardBody>
    </Card>
  );
}
