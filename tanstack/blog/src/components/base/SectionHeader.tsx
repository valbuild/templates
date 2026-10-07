import { cn } from "../../utils/cn";
import { Eyebrow } from "../typography/Eyebrow";
import { Heading, type HeadingSize } from "../typography/Heading";
import { Text } from "../typography/Text";

/**
 * Eyebrow, title and intro, in the one arrangement every section uses: so a
 * page reads as one design rather than as sections that each had an idea.
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "start",
  size = "lg",
  level = 2,
  className,
}: {
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  align?: "start" | "center";
  size?: HeadingSize;
  level?: 1 | 2;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-[44rem] flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading level={level} size={size}>
        {title}
      </Heading>
      {intro && (
        <Text size="lg" tone="muted">
          {intro}
        </Text>
      )}
    </div>
  );
}
