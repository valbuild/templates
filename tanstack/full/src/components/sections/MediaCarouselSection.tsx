import type { MediaCarouselSectionSchema } from "./mediaCarouselSection.val";
import { Section } from "../base/Section";
import { SectionHeader } from "../base/SectionHeader";
import { Stack } from "../base/Stack";
import { Carousel } from "../base/Carousel";
import { Media } from "../atoms/Media";
import { Caption } from "../typography/Caption";

export function MediaCarouselSection({
  eyebrow,
  title,
  intro,
  slides,
  surface,
}: MediaCarouselSectionSchema) {
  return (
    <Section surface={surface}>
      <Stack gap="lg">
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
        <Carousel label={title}>
          {slides.map((slide, index) => (
            <figure key={index} className="flex flex-col gap-3">
              <Media
                media={{ type: "image", image: slide.image }}
                aspect="landscape"
              />
              {slide.caption && (
                <figcaption>
                  <Caption>{slide.caption}</Caption>
                </figcaption>
              )}
            </figure>
          ))}
        </Carousel>
      </Stack>
    </Section>
  );
}
