import { cn } from "../../utils/cn";

export type TextSize = "lg" | "md" | "sm";
export type TextTone = "default" | "muted";

const SIZE: Record<TextSize, string> = {
  lg: "text-(length:--step-1) leading-[1.55]",
  md: "text-(length:--step-0) leading-[1.65]",
  sm: "text-(length:--step-minus-1) leading-[1.6]",
};

/**
 * Body text. `lg` is a lead paragraph, `md` running text, `sm` small print.
 * `muted` is secondary text — the theme guarantees it is still readable on
 * every surface.
 */
export function Text({
  size = "md",
  tone = "default",
  as: Tag = "p",
  className,
  children,
}: {
  size?: TextSize;
  tone?: TextTone;
  as?: "p" | "span" | "div";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "font-body text-pretty",
        SIZE[size],
        tone === "muted" ? "text-fg-muted" : "text-fg",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
