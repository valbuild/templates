import { cn } from "../../utils/cn";

/**
 * Questions and answers, one open at a time if you like.
 *
 * Native `<details>`: it opens without JavaScript, works with the keyboard and
 * screen readers as they expect, and its content is found by the browser's
 * find-in-page even while closed.
 */
export function Accordion({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("divide-y divide-border border-y border-border", className)}
    >
      {children}
    </div>
  );
}

export function AccordionItem({
  summary,
  group,
  defaultOpen,
  children,
}: {
  summary: React.ReactNode;
  /** Items sharing a group close each other when opened. */
  group?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details name={group} open={defaultOpen} className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-heading text-(length:--step-1) [font-weight:var(--heading-weight)] [letter-spacing:var(--heading-tracking)] text-fg marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-link [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span
          aria-hidden
          className="relative size-4 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-current after:transition-transform group-open:after:scale-y-0 motion-reduce:after:transition-none"
        />
      </summary>
      <div className="pb-6 pr-10">{children}</div>
    </details>
  );
}
