import { cn } from "../../utils/cn";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg";

/**
 * The classes every button-looking thing shares, so a `LinkButton` and a
 * `Button` cannot drift apart. Shape, case and how `primary` is drawn (solid,
 * outline or soft) come from the theme; see `.button` in `theme.css`.
 */
export function buttonClassName(size: ButtonSize = "md", className?: string) {
  return cn(
    "button inline-flex items-center justify-center gap-2 font-body font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link disabled:opacity-50",
    size === "lg"
      ? "px-6 py-3 text-(length:--step-1)"
      : "px-5 py-2.5 text-(length:--step-0)",
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-variant={variant}
      className={buttonClassName(size, className)}
      {...props}
    />
  );
}
