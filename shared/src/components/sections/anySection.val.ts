import type { t } from "@valbuild/tanstack";
import { s } from "../../../val.config";
import { heroSection } from "./heroSection.val";
import { cardGridSection } from "./cardGridSection.val";
import { imageTextSection } from "./imageTextSection.val";
import { mediaCarouselSection } from "./mediaCarouselSection.val";
import { accordionSection } from "./accordionSection.val";
import { titleTextSection } from "./titleTextSection.val";
import { proseToString } from "../typography/prose.val";
import type { ImageSource, SelectorOfSchema } from "@valbuild/core";

/*
 * Every section a page can hold. The order here is the order of the Studio's
 * "add section" list, so it runs roughly top of a page to bottom.
 */
export const anySection = s.discriminatedUnion(
  "type",
  heroSection,
  titleTextSection,
  imageTextSection,
  cardGridSection,
  mediaCarouselSection,
  accordionSection,
);
export type AnySectionSchema = t.inferSchema<typeof anySection>;

export const sections = s.array(anySection);

type SectionPreview = {
  title: string;
  subtitle: string | null;
  image: ImageSource | null;
};

/**
 * How a section shows in the Studio's list of a page's sections: its title,
 * a line about it, and its first image.
 */
export const sectionListPreview = ({
  val,
}: {
  val: SelectorOfSchema<typeof anySection>;
}): SectionPreview => {
  if (val.type === "hero") {
    return {
      title: val.title,
      subtitle: val.intro,
      image: val.background?.type === "image" ? val.background.image : null,
    };
  } else if (val.type === "title-text") {
    return {
      title: val.title,
      subtitle: proseToString(val.text),
      image: null,
    };
  } else if (val.type === "image-text") {
    return {
      title: val.title,
      subtitle: proseToString(val.text),
      image: val.image,
    };
  } else if (val.type === "card-grid") {
    return {
      title: val.title,
      subtitle: `${val.cards.length} cards`,
      image: val.cards.find((card) => card.image)?.image ?? null,
    };
  } else if (val.type === "media-carousel") {
    return {
      title: val.title,
      subtitle: `${val.slides.length} slides`,
      image: val.slides[0]?.image ?? null,
    };
  } else if (val.type === "accordion") {
    return {
      title: val.title,
      subtitle: `${val.items.length} items`,
      image: null,
    };
  } else {
    const exhaustiveCheck: never = val;
    console.error("Unhandled section type", exhaustiveCheck);
    return {
      title: "Unknown section type",
      subtitle: null,
      image: null,
    };
  }
};
