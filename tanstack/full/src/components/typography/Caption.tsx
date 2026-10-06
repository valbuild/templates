import { cn } from "../../utils/cn";

/** A caption under an image, a table or a quote. */
export function Caption({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-body text-(length:--step-minus-1) leading-normal text-fg-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
