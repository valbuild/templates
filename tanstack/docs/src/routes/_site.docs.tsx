import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { Container } from "../components/base/Container";
import { DocsSidebar } from "../components/docs/DocsSidebar";
import { useDocs } from "../components/docs/useDocs";

/**
 * The docs' layout: the sidebar beside every docs page, and the contents page
 * at /docs. A layout route, so the sidebar is not rebuilt on every navigation
 * between pages — only the page beside it changes.
 *
 * On a phone the sidebar is a "Contents" disclosure above the page, closed,
 * so the page is the first thing on the screen.
 */
export const Route = createFileRoute("/_site/docs")({
  component: DocsLayout,
});

function DocsLayout() {
  const { order, byUrl } = useDocs();
  const pathname = useLocation({ select: (location) => location.pathname });
  return (
    <Container className="py-section">
      <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <details className="lg:hidden rounded-theme-lg border border-border px-4 py-3">
          <summary className="cursor-pointer font-body font-semibold">
            Contents
          </summary>
          <DocsSidebar
            groups={order.groups}
            byUrl={byUrl}
            current={pathname}
            className="mt-4"
          />
        </details>
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <DocsSidebar
              groups={order.groups}
              byUrl={byUrl}
              current={pathname}
            />
          </div>
        </aside>
        <Outlet />
      </div>
    </Container>
  );
}
