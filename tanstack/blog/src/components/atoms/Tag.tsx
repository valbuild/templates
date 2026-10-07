import { cn } from "../../utils/cn";

/**
 * A short label: a category, a status, "New". In the accent colour, so it
 * reads as a highlight rather than as something to click.
 */
export function Tag({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[min(var(--radius),0.375rem)] bg-highlight-tint px-2 py-0.5 font-body text-(length:--step-minus-1) font-semibold text-on-highlight-tint",
        className,
      )}
    >
      {children}
    </span>
  );
}
