import { ValImage } from "../../framework";
import { Text } from "../typography/Text";
import type { AuthorSchema } from "../../content/authors.val";
import { formatDate } from "./posts";

/** Who wrote it and when: an avatar, a name and a date on one line. */
export function Byline({
  author,
  published,
}: {
  /** Null when the post names an author that is no longer in the list. */
  author: AuthorSchema | null;
  published: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {author?.avatar && (
        <ValImage
          src={author.avatar}
          className="size-10 shrink-0 rounded-full bg-subtle object-cover"
        />
      )}
      <div>
        {author && (
          <Text size="sm" className="font-semibold">
            {author.name}
          </Text>
        )}
        <Text size="sm" tone="muted">
          <time dateTime={published}>{formatDate(published)}</time>
        </Text>
      </div>
    </div>
  );
}
