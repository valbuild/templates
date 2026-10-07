import { AnySection } from "../sections/AnySection";
import type { HomeSectionSchema } from "./homeSection.val";
import { LatestPostsSection } from "./LatestPostsSection";

export function HomeSection({ section }: { section: HomeSectionSchema }) {
  if (section.type === "latest-posts") {
    return <LatestPostsSection {...section} />;
  }
  return <AnySection section={section} />;
}
