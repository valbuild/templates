import { cn } from "../../utils/cn";

/**
 * The short line above a heading ("Case study", "New"). In the accent colour,
 * and upper case with wide tracking unless the theme says otherwise.
 */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-body text-(length:--step-minus-1) font-semibold text-highlight [letter-spacing:var(--eyebrow-tracking)] [text-transform:var(--eyebrow-case)]",
        className,
      )}
    >
      {children}
    </p>
  );
}
