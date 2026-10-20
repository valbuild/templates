import { AnySection } from "../sections/AnySection";
import type { HomeSectionSchema } from "./homeSection.val";
import { LatestPostsSection } from "./LatestPostsSection";

/** `priority` for the page's first section; see `AnySection`. */
export function HomeSection({
  section,
  priority = false,
}: {
  section: HomeSectionSchema;
  priority?: boolean;
}) {
  if (section.type === "latest-posts") {
    return <LatestPostsSection {...section} priority={priority} />;
  }
  return <AnySection section={section} priority={priority} />;
}
