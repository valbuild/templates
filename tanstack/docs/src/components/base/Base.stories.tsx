import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody } from "./Card";
import { Section } from "./Section";
import { Grid } from "./Grid";
import { Stack } from "./Stack";
import { Cluster } from "./Cluster";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";
import { Eyebrow } from "../typography/Eyebrow";
import { Media } from "../atoms/Media";
import { Tag } from "../atoms/Tag";
import { LinkButton } from "../atoms/LinkButton";
import {
  landscapeMedia,
  portraitMedia,
  squareMedia,
} from "../../stories/fixtures";

const meta = {
  title: "Base",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Flat, outlined or raised comes from the theme. Compare Clean with Soft. */
export const Cards: Story = {
  render: () => (
    <Grid columns={3}>
      {[landscapeMedia, squareMedia, portraitMedia].map((media, index) => (
        <Card key={index}>
          <Media media={media} aspect="landscape" rounded={false} />
          <CardBody>
            <Tag className="self-start">Guide</Tag>
            <Heading level={3} size="xs">
              Getting the most out of a theme
            </Heading>
            <Text size="sm" tone="muted">
              Pick a preset, then change only what makes the site yours.
            </Text>
          </CardBody>
        </Card>
      ))}
    </Grid>
  ),
};

/**
 * The band a section is drawn in. Vertical rhythm follows the theme's density;
 * the surface decides every colour inside.
 */
export const Sections: Story = {
  parameters: { pad: false },
  render: () => (
    <>
      {(["default", "muted", "brand", "inverse"] as const).map((surface) => (
        <Section key={surface} surface={surface}>
          <Stack gap="sm" align="start">
            <Eyebrow>{surface}</Eyebrow>
            <Heading level={2}>A section on the {surface} surface</Heading>
            <Text tone="muted">
              Spacing above and below is the theme&apos;s density.
            </Text>
            <Cluster>
              <LinkButton href="#">Primary</LinkButton>
              <LinkButton href="#" variant="secondary">
                Secondary
              </LinkButton>
            </Cluster>
          </Stack>
        </Section>
      ))}
    </>
  ),
};

/** Stack, Cluster and Grid: gaps scale with the theme's density. */
export const Layout: Story = {
  render: () => {
    const box =
      "rounded-theme bg-tint p-4 text-on-tint font-body text-(length:--step-minus-1)";
    return (
      <Stack gap="lg">
        <Stack gap="sm">
          <Text size="sm" tone="muted">
            Stack
          </Text>
          <div className={box}>One</div>
          <div className={box}>Two</div>
        </Stack>
        <Stack gap="sm">
          <Text size="sm" tone="muted">
            Cluster
          </Text>
          <Cluster>
            {["One", "Two", "Three", "Four", "Five"].map((label) => (
              <div key={label} className={box}>
                {label}
              </div>
            ))}
          </Cluster>
        </Stack>
        <Stack gap="sm">
          <Text size="sm" tone="muted">
            Grid
          </Text>
          <Grid columns={4}>
            {["One", "Two", "Three", "Four"].map((label) => (
              <div key={label} className={box}>
                {label}
              </div>
            ))}
          </Grid>
        </Stack>
      </Stack>
    );
  },
};
