import { ValRichText } from "../../framework";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";
import { TextLink } from "../typography/TextLink";
import type { DocTextSchema } from "./doc.val";

/** Running text in the docs, set in the site's type. */
export function DocText({ value }: { value: DocTextSchema }) {
  return (
    <ValRichText
      theme={{
        bold: "font-semibold",
        italic: "italic",
        lineThrough: "line-through",
        ul: "list-disc pl-6 my-4 space-y-1",
        ol: "list-decimal pl-6 my-4 space-y-1",
        li: null,
        h2: null,
        h3: null,
        a: null,
        img: "my-6 block h-auto w-full rounded-theme-lg bg-subtle",
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
