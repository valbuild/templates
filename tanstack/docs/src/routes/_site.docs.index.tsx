import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "../components/NotFound";
import { Stack } from "../components/base/Stack";
import { RouterLink } from "../framework";
import { Heading } from "../components/typography/Heading";
import { Text } from "../components/typography/Text";
import { useDocs } from "../components/docs/useDocs";
import { useValRoute } from "../val/val.hooks";
import pageVal from "./_site.docs.index.val";

/**
 * /docs: the contents, in full — every group and every page with its
 * description, in the order the sidebar lists them.
 */
export const Route = createFileRoute("/_site/docs/")({
  head: () => ({ meta: [{ title: "Documentation" }] }),
  component: DocsIndex,
});

function DocsIndex() {
  const page = useValRoute(pageVal, {});
  const { order, byUrl } = useDocs();
  if (!page) {
    return <NotFound />;
  }
  return (
    <div className="min-w-0 max-w-3xl">
      <Stack gap="sm" className="mb-10">
        <Heading level={1} size="xl">
          {page.title}
        </Heading>
        {page.intro && (
          <Text size="lg" tone="muted">
            {page.intro}
          </Text>
        )}
      </Stack>
      <Stack gap="lg">
        {order.groups.map((group) => (
          <section key={group.label}>
            <Heading level={2} size="sm" className="mb-3">
              {group.label}
            </Heading>
            <ul className="flex flex-col divide-y divide-border border-y border-border">
              {group.urls.map((url) => {
                const doc = byUrl.get(url);
                return (
                  <li key={url}>
                    <RouterLink
                      href={url}
                      className="block py-3 no-underline hover:bg-subtle"
                    >
                      <Text className="font-semibold">{doc?.title ?? url}</Text>
                      {doc?.description && (
                        <Text size="sm" tone="muted">
                          {doc.description}
                        </Text>
                      )}
                    </RouterLink>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </Stack>
    </div>
  );
}
