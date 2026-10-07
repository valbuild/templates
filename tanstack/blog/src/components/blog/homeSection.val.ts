import type { SelectorOfSchema } from "@valbuild/core";
import { s, type t } from "../../../val.config";
import { accordionSection } from "../sections/accordionSection.val";
import { sectionListPreview } from "../sections/anySection.val";
import { cardGridSection } from "../sections/cardGridSection.val";
import { heroSection } from "../sections/heroSection.val";
import { imageTextSection } from "../sections/imageTextSection.val";
import { mediaCarouselSection } from "../sections/mediaCarouselSection.val";
import { titleTextSection } from "../sections/titleTextSection.val";
import { latestPostsSection } from "./latestPostsSection.val";

/*
 * The front page's sections: every shared section, and Latest Posts, which only
 * this template has. The shared list (`anySection`) is left as it is — it is
 * the same file in every template — and this one is built beside it.
 */
export const homeSection = s.discriminatedUnion(
  "type",
  heroSection,
  latestPostsSection,
  titleTextSection,
  imageTextSection,
  cardGridSection,
  mediaCarouselSection,
  accordionSection,
);

export type HomeSectionSchema = t.inferSchema<typeof homeSection>;

export const homeSectionPreview = ({
  val,
}: {
  val: SelectorOfSchema<typeof homeSection>;
}) => {
  if (val.type === "latest-posts") {
    return {
      title: val.title,
      subtitle: `The ${val.count} newest posts`,
      image: null,
    };
  }
  return sectionListPreview({ val });
};
