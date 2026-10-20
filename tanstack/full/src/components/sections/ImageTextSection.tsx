import type { ImageTextSectionSchema } from "./imageTextSection.val";
import { Heading } from "../typography/Heading";
import { Prose } from "../typography/Prose";
import { Section } from "../base/Section";
import { Grid } from "../base/Grid";
import { Stack } from "../base/Stack";
import { Media } from "../atoms/Media";

export function ImageTextSection({
  image,
  imageSide,
  title,
  text,
  surface,
  priority,
}: ImageTextSectionSchema & {
  /**
   * In view when the page opens -- the page's first section -- so its media
   * loads first instead of lazily. See `Media`.
   */
  priority?: boolean;
}) {
  return (
    <Section surface={surface}>
      <Grid columns={image ? 2 : 1} gap="lg" className="items-center">
        {image && (
          <Media
            media={{ type: "image", image }}
            aspect="landscape"
            priority={priority}
            className={imageSide === "right" ? "sm:order-last" : undefined}
          />
        )}
        <Stack gap="sm">
          <Heading level={2}>{title}</Heading>
          <Prose value={text} />
        </Stack>
      </Grid>
    </Section>
  );
}
