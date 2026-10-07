import type { AnySectionSchema } from "./anySection.val";
import { HeroSection } from "./HeroSection";
import { TitleTextSection } from "./TitleTextSection";
import { ImageTextSection } from "./ImageTextSection";
import { CardGridSection } from "./CardGridSection";
import { MediaCarouselSection } from "./MediaCarouselSection";
import { AccordionSection } from "./AccordionSection";

export function AnySection({ section }: { section: AnySectionSchema }) {
  if (section.type === "hero") {
    return <HeroSection {...section} />;
  } else if (section.type === "title-text") {
    return <TitleTextSection {...section} />;
  } else if (section.type === "image-text") {
    return <ImageTextSection {...section} />;
  } else if (section.type === "card-grid") {
    return <CardGridSection {...section} />;
  } else if (section.type === "media-carousel") {
    return <MediaCarouselSection {...section} />;
  } else if (section.type === "accordion") {
    return <AccordionSection {...section} />;
  } else {
    const exhaustiveCheck: never = section;
    console.error("Unhandled section type", exhaustiveCheck);
    return null;
  }
}
