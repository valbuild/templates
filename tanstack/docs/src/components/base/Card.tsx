import { cn } from "../../utils/cn";

/**
 * A box around one thing in a set. Flat, outlined or raised is the theme's
 * choice (`base.card.style`), never the card's; see `.card` in `theme.css`.
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("card flex flex-col", className)}>{children}</div>;
}

/** The padded part of a card, under its media. */
export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-1 flex-col gap-3 p-5 sm:p-6", className)}>
      {children}
    </div>
  );
}
