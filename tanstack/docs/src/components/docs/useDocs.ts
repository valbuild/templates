import { useMemo } from "react";
import { val } from "../../../val.config";
import { useVal } from "../../val/val.hooks";
import docsVal from "../../routes/_site.docs.$.val";
import { docsOrder, type DocsOrder } from "./docsOrder.val";

/**
 * Every docs page, and the order they are read in.
 *
 * Read with the hook, so the sidebar follows an editor's changes as they type
 * — a new page, a renamed group or a changed Next link moves the sidebar
 * without a reload. The order is worked out on `val.raw` values: what the hook
 * returns carries invisible edit tags, which must not decide what equals what.
 */
export function useDocs() {
  const pages = useVal(docsVal);
  const order = useMemo<DocsOrder>(
    () =>
      docsOrder(
        Object.entries(pages).map(([url, page]) => ({
          url: val.raw(url),
          group: val.raw(page.group),
          next: page.next === null ? null : val.raw(page.next),
        })),
      ),
    [pages],
  );
  // Keyed by the raw URL, so the order's URLs find their pages.
  const byUrl = useMemo(
    () =>
      new Map(Object.entries(pages).map(([url, page]) => [val.raw(url), page])),
    [pages],
  );
  return { order, byUrl };
}
