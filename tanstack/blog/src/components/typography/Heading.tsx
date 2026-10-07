import { cn } from "../../utils/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "display" | "xl" | "lg" | "md" | "sm" | "xs";

const SIZE: Record<HeadingSize, string> = {
  display: "text-(length:--step-6) leading-[1.02]",
  xl: "text-(length:--step-5) leading-[1.05]",
  lg: "text-(length:--step-4) leading-[1.1]",
  md: "text-(length:--step-3) leading-[1.15]",
  sm: "text-(length:--step-2) leading-[1.25]",
  xs: "text-(length:--step-1) leading-[1.3]",
};

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: "xl",
  2: "lg",
  3: "md",
  4: "sm",
  5: "xs",
  6: "xs",
};

/**
 * A heading in the site's type: its font, weight, case and scale all come from
 * the theme.
 *
 * `level` is what the heading IS in the page outline (h1–h6); `size` is how
 * big it LOOKS. They are separate because the same card title is an h3 on one
 * page and an h2 on another, and must look the same on both. Leave `size` out
 * and it follows the level.
 */
export function Heading({
  level,
  size = DEFAULT_SIZE[level],
  className,
  children,
}: {
  level: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag: `h${HeadingLevel}` = `h${level}`;
  return (
    <Tag
      className={cn(
        "font-heading [font-weight:var(--heading-weight)] [letter-spacing:var(--heading-tracking)] [text-transform:var(--heading-case)] text-balance",
        SIZE[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
