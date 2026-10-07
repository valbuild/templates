import { RouterLink } from "../../framework";
import { Text } from "../typography/Text";
import type { DocPageSchema } from "./doc.val";

type Neighbour = { url: string; page: DocPageSchema } | null;

/**
 * Previous and Next at the bottom of a page. Next is the page's own link;
 * Previous is the page that links here. Either can be missing, and then that
 * side is simply empty.
 */
export function DocsPager({
  previous,
  next,
}: {
  previous: Neighbour;
  next: Neighbour;
}) {
  if (!previous && !next) {
    return null;
  }
  return (
    <nav
      aria-label="Previous and next page"
      className="mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
    >
      {previous ? <PagerLink label="Previous" target={previous} /> : <span />}
      {next && <PagerLink label="Next" target={next} alignEnd />}
    </nav>
  );
}

function PagerLink({
  label,
  target,
  alignEnd = false,
}: {
  label: string;
  target: NonNullable<Neighbour>;
  alignEnd?: boolean;
}) {
  return (
    <RouterLink
      href={target.url}
      className={
        "block rounded-theme-lg border border-border px-4 py-3 no-underline hover:bg-subtle " +
        (alignEnd ? "sm:text-right" : "")
      }
    >
      <Text size="sm" tone="muted">
        {label === "Previous" ? `← ${label}` : `${label} →`}
      </Text>
      <Text className="font-semibold">{target.page.title}</Text>
    </RouterLink>
  );
}
