import { cn } from "../../utils/cn";

export type Space = "xs" | "sm" | "md" | "lg";

/** Gaps scale with the theme's density; `md` is the density's own gap. */
export const GAP: Record<Space, string> = {
  xs: "gap-[calc(var(--space-gap)*0.25)]",
  sm: "gap-[calc(var(--space-gap)*0.5)]",
  md: "gap-gap",
  lg: "gap-[calc(var(--space-gap)*2)]",
};

/** Things one above the other, evenly spaced. */
export function Stack({
  gap = "md",
  align = "stretch",
  className,
  children,
}: {
  gap?: Space;
  align?: "start" | "center" | "stretch";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        GAP[gap],
        align === "center" && "items-center text-center",
        align === "start" && "items-start",
        className,
      )}
    >
      {children}
    </div>
  );
}
