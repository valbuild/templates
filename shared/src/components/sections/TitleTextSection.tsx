import type { TitleTextSectionSchema } from "./titleTextSection.val";
import { Heading } from "../typography/Heading";
import { Prose } from "../typography/Prose";
import { Section } from "../base/Section";
import { Grid } from "../base/Grid";
import { Stack } from "../base/Stack";
import { Cluster } from "../base/Cluster";
import { LinkButton } from "../atoms/LinkButton";
import { hrefOf } from "../atoms/hrefOf";

export function TitleTextSection({
  title,
  text,
  buttons,
  surface,
}: TitleTextSectionSchema) {
  return (
    <Section surface={surface}>
      <Grid columns={2} gap="lg">
        <Heading level={2}>{title}</Heading>
        <Stack gap="md" align="start">
          <Prose value={text} />
          <Cluster>
            {buttons.map((button, index) => (
              <LinkButton
                key={index}
                href={hrefOf(button)}
                variant={button.variant}
              >
                {button.label}
              </LinkButton>
            ))}
          </Cluster>
        </Stack>
      </Grid>
    </Section>
  );
}
