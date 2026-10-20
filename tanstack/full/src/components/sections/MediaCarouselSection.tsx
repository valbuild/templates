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
  priority,
}: MediaCarouselSectionSchema & {
  /**
   * In view when the page opens -- the page's first section -- so its media
   * loads first instead of lazily. See `Media`.
   */
  priority?: boolean;
}) {
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
                // Only the first slide is in view; the rest are scrolled to.
                priority={priority && index === 0}
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
