import { ValRichText } from "../../framework";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";
import { TextLink } from "../typography/TextLink";
import type { PostBodySchema } from "./post.val";

/**
 * A post's body, set in the site's type like `Prose`, with room to read: a
 * narrower measure, more space around headings, and images that span it.
 */
export function PostBody({
  value,
  className,
}: {
  value: PostBodySchema;
  className?: string;
}) {
  return (
    <ValRichText
      className={className}
      theme={{
        bold: "font-semibold",
        italic: "italic",
        lineThrough: "line-through",
        ul: "list-disc pl-6 my-5 space-y-1",
        ol: "list-decimal pl-6 my-5 space-y-1",
        li: null,
        h2: null,
        h3: null,
        a: null,
        img: "my-8 block h-auto w-full rounded-theme-lg bg-subtle",
      }}
      transform={(node, children, className, key) => {
        if (typeof node === "string") {
          return undefined;
        }
        if (node.tag === "h2") {
          return (
            <Heading
              key={key}
              level={2}
              size="md"
              className={className + " mt-10 mb-3"}
            >
              {children}
            </Heading>
          );
        } else if (node.tag === "h3") {
          return (
            <Heading
              key={key}
              level={3}
              size="sm"
              className={className + " mt-8 mb-2"}
            >
              {children}
            </Heading>
          );
        } else if (node.tag === "p") {
          return (
            <Text
              key={key}
              size="lg"
              className={className + " my-4 first:mt-0 last:mb-0"}
            >
              {children}
            </Text>
          );
        } else if (node.tag === "a") {
          return (
            <TextLink key={key} href={node.href} className={className}>
              {children}
            </TextLink>
          );
        }
        return undefined;
      }}
    >
      {value}
    </ValRichText>
  );
}
