import type { AnySectionSchema } from "./anySection.val";
import { HeroSection } from "./HeroSection";
import { TitleTextSection } from "./TitleTextSection";
import { ImageTextSection } from "./ImageTextSection";
import { CardGridSection } from "./CardGridSection";
import { MediaCarouselSection } from "./MediaCarouselSection";
import { AccordionSection } from "./AccordionSection";

/**
 * One section of a page, whichever type it is.
 *
 * Pass `priority` for the page's first section: it is in view when the page
 * opens, so its media loads first rather than lazily. Every other section's
 * media waits until it is scrolled near.
 */
export function AnySection({
  section,
  priority = false,
}: {
  section: AnySectionSchema;
  priority?: boolean;
}) {
  if (section.type === "hero") {
    return <HeroSection {...section} />;
  } else if (section.type === "title-text") {
    return <TitleTextSection {...section} />;
  } else if (section.type === "image-text") {
    return <ImageTextSection {...section} priority={priority} />;
  } else if (section.type === "card-grid") {
    return <CardGridSection {...section} priority={priority} />;
  } else if (section.type === "media-carousel") {
    return <MediaCarouselSection {...section} priority={priority} />;
  } else if (section.type === "accordion") {
    return <AccordionSection {...section} />;
  } else {
    const exhaustiveCheck: never = section;
    console.error("Unhandled section type", exhaustiveCheck);
    return null;
  }
}
