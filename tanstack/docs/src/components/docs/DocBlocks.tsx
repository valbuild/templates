import type { DocBlockSchema } from "./doc.val";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { DocText } from "./DocText";

export function DocBlocks({ blocks }: { blocks: DocBlockSchema[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "text") {
          return <DocText key={index} value={block.text} />;
        } else if (block.type === "code") {
          return (
            <CodeBlock
              key={index}
              filename={block.filename}
              code={block.code}
            />
          );
        } else if (block.type === "callout") {
          return (
            <Callout
              key={index}
              tone={block.tone}
              title={block.title}
              text={block.text}
            />
          );
        }
        const exhaustiveCheck: never = block;
        console.error("Unhandled docs block", exhaustiveCheck);
        return null;
      })}
    </>
  );
}
