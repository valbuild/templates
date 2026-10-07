import { RouterLink } from "../../framework";
import { cn } from "../../utils/cn";
import { Eyebrow } from "../typography/Eyebrow";
import type { DocPageSchema } from "./doc.val";
import type { DocsGroup } from "./docsOrder.val";

/**
 * The docs' contents: each group as a heading, and its pages in reading order.
 * The page being read is marked, for the eye and for a screen reader.
 */
export function DocsSidebar({
  groups,
  byUrl,
  current,
  className,
}: {
  groups: DocsGroup[];
  byUrl: Map<string, DocPageSchema>;
  /** The URL being read, to mark it. */
  current: string | null;
  className?: string;
}) {
  return (
    <nav aria-label="Docs" className={cn("flex flex-col gap-6", className)}>
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <Eyebrow>{group.label}</Eyebrow>
          <ul className="flex flex-col gap-1">
            {group.urls.map((url) => {
              const page = byUrl.get(url);
              const isCurrent = url === current;
              return (
                <li key={url}>
                  <RouterLink
                    href={url}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "block rounded-theme px-2 py-1 font-body text-(length:--step-minus-1) no-underline",
                      isCurrent
                        ? "bg-subtle font-semibold text-fg"
                        : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {page?.title ?? url}
                  </RouterLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
