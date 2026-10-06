import { ValRichText } from "../../framework";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { TextLink } from "./TextLink";
import type { ProseSchema } from "./prose.val";

/**
 * Rich text from Val, set in the site's type: headings are `Heading`,
 * paragraphs are `Text`, links are `TextLink` — so a theme change reaches the
 * body copy too.
 *
 * Headings inside prose are SUBheadings of the section they sit in, which is
 * why an h2 here is drawn at `md`, not at the h2 default.
 */
export function Prose({
  value,
  className,
}: {
  value: ProseSchema;
  className?: string;
}) {
  return (
    <ValRichText
      className={className}
      theme={{
        bold: "font-semibold",
        italic: "italic",
        ul: "list-disc pl-6 my-4 space-y-1",
        ol: "list-decimal pl-6 my-4 space-y-1",
        li: null,
        h2: null,
        h3: null,
        a: null,
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
              className={className + " mt-8 mb-3"}
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
              className={className + " mt-6 mb-2"}
            >
              {children}
            </Heading>
          );
        } else if (node.tag === "p") {
          return (
            <Text
              key={key}
              className={className + " my-3 first:mt-0 last:mb-0"}
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
