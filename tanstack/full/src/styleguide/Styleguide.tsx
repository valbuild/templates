import { RAMP_STEPS } from "../theme/ramp";
import { Heading, type HeadingSize } from "../components/typography/Heading";
import { Text } from "../components/typography/Text";
import { Eyebrow } from "../components/typography/Eyebrow";
import { Caption } from "../components/typography/Caption";
import { TextLink } from "../components/typography/TextLink";
import { Prose } from "../components/typography/Prose";
import { Button } from "../components/atoms/Button";
import { Tag } from "../components/atoms/Tag";
import { Icon } from "../components/atoms/Icon";
import { Media } from "../components/atoms/Media";
import { Divider } from "../components/atoms/Divider";
import { Section, type Surface } from "../components/base/Section";
import { Stack } from "../components/base/Stack";
import { Cluster } from "../components/base/Cluster";
import { Grid } from "../components/base/Grid";
import { Card, CardBody } from "../components/base/Card";
import {
  icons,
  landscapeMedia,
  portraitMedia,
  sampleProse,
  squareMedia,
} from "../stories/fixtures";

/*
 * Every layer of the design, on one page, in whatever theme is active.
 *
 * On the site it is `/styleguide`, drawn with the theme from `theme.val.ts` —
 * so an editor changing the theme in the Studio sees every component follow
 * at once, instead of hunting for a page that happens to have a button. In
 * Storybook it is the same components under the toolbar's preset.
 */

export function PaletteSpecimen() {
  const ramps = [
    { name: "brand", label: "Brand" },
    { name: "accent", label: "Accent" },
    { name: "n", label: "Neutral" },
  ];
  return (
    <Stack gap="md">
      {ramps.map(({ name, label }) => (
        <div
          key={name}
          className="grid grid-cols-[5rem_1fr] items-center gap-4"
        >
          <Text size="sm" tone="muted" as="span">
            {label}
          </Text>
          <div className="grid grid-cols-11 overflow-hidden rounded-theme">
            {RAMP_STEPS.map((step) => (
              <div
                key={step}
                title={`--${name}-${step}`}
                className="h-12"
                style={{ backgroundColor: `var(--${name}-${step})` }}
              />
            ))}
          </div>
        </div>
      ))}
      <Cluster gap="md">
        <Swatch name="--brand" on="--on-brand" label="Brand, exact" />
        <Swatch name="--accent" on="--on-accent" label="Accent, exact" />
      </Cluster>
    </Stack>
  );
}

function Swatch({
  name,
  on,
  label,
}: {
  name: string;
  on: string;
  label: string;
}) {
  return (
    <div
      className="flex h-16 w-48 items-end rounded-theme p-3 font-body text-(length:--step-minus-1) font-semibold"
      style={{ backgroundColor: `var(${name})`, color: `var(${on})` }}
    >
      {label}
    </div>
  );
}

const SURFACES: Surface[] = ["default", "muted", "brand", "inverse"];

export function SurfaceSample({ surface }: { surface: Surface }) {
  return (
    <div data-surface={surface} className="rounded-theme-lg p-6 sm:p-8">
      <Stack gap="sm" align="start">
        <Eyebrow>{surface} surface</Eyebrow>
        <Heading level={3} size="sm">
          Legible wherever it lands
        </Heading>
        <Text tone="muted">
          Muted text, and <TextLink href="#">a link</TextLink> in running text.
        </Text>
        <Cluster>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Tag>New</Tag>
        </Cluster>
      </Stack>
    </div>
  );
}

export function SurfacesSpecimen() {
  return (
    <Grid columns={2}>
      {SURFACES.map((surface) => (
        <SurfaceSample key={surface} surface={surface} />
      ))}
    </Grid>
  );
}

const HEADING_SIZES: HeadingSize[] = ["display", "xl", "lg", "md", "sm", "xs"];

export function TypeSpecimen() {
  return (
    <Stack gap="lg">
      <Stack gap="sm">
        {HEADING_SIZES.map((size) => (
          <div
            key={size}
            className="grid grid-cols-[4rem_1fr] items-baseline gap-4"
          >
            <Caption>{size}</Caption>
            <Heading level={3} size={size}>
              The quick brown fox
            </Heading>
          </div>
        ))}
      </Stack>
      <Divider />
      <Grid columns={2} gap="lg">
        <Stack gap="sm">
          <Eyebrow>Eyebrow</Eyebrow>
          <Heading level={3} size="md">
            A heading with a lead
          </Heading>
          <Text size="lg">
            A lead paragraph sets up what follows, a size up from running text.
          </Text>
          <Text>
            Running text is where most of the reading happens, so it gets the
            theme&apos;s body font at a comfortable measure and line height.
          </Text>
          <Text size="sm" tone="muted">
            Small print, muted.
          </Text>
        </Stack>
        <Prose value={sampleProse} />
      </Grid>
    </Stack>
  );
}

const FEATURES = [
  {
    icon: icons.spark,
    title: "Unique",
    text: "Four presets, and every choice in them can be overridden.",
  },
  {
    icon: icons.leaf,
    title: "Legible",
    text: "Text clears WCAG AA on every surface, whatever colour is picked.",
  },
  {
    icon: icons.bolt,
    title: "Fast",
    text: "Server rendered and self-hosted: no flash, no font requests elsewhere.",
  },
];

export function ComponentsSpecimen() {
  return (
    <Stack gap="lg">
      <Grid columns={3}>
        {[landscapeMedia, squareMedia, portraitMedia].map((media, index) => (
          <Card key={index}>
            <Media media={media} aspect="landscape" rounded={false} />
            <CardBody>
              <Cluster gap="xs">
                <Tag>Story</Tag>
              </Cluster>
              <Heading level={3} size="xs">
                A card with media
              </Heading>
              <Text size="sm" tone="muted">
                Flat, outlined or raised is the theme&apos;s choice, not the
                card&apos;s.
              </Text>
              <TextLink href="#">Read more</TextLink>
            </CardBody>
          </Card>
        ))}
      </Grid>
      <Grid columns={3}>
        {FEATURES.map((feature) => (
          <Stack key={feature.title} gap="sm">
            <span className="inline-flex size-12 items-center justify-center rounded-theme bg-tint text-on-tint">
              <Icon icon={feature.icon} size="md" />
            </span>
            <Heading level={3} size="xs">
              {feature.title}
            </Heading>
            <Text size="sm" tone="muted">
              {feature.text}
            </Text>
          </Stack>
        ))}
      </Grid>
    </Stack>
  );
}

export function Styleguide() {
  return (
    <>
      <Section>
        <Stack gap="sm">
          <Eyebrow>Style guide</Eyebrow>
          <Heading level={1} size="display">
            Every part, one theme
          </Heading>
          <Text size="lg" tone="muted">
            Typography, atoms and base components as the current theme draws
            them. Change the theme and everything here follows.
          </Text>
        </Stack>
      </Section>
      <Section surface="muted">
        <Stack gap="lg">
          <Heading level={2} size="md">
            Colour
          </Heading>
          <PaletteSpecimen />
        </Stack>
      </Section>
      <Section>
        <Stack gap="lg">
          <Heading level={2} size="md">
            Surfaces
          </Heading>
          <SurfacesSpecimen />
        </Stack>
      </Section>
      <Section>
        <Stack gap="lg">
          <Heading level={2} size="md">
            Type
          </Heading>
          <TypeSpecimen />
        </Stack>
      </Section>
      <Section surface="muted">
        <Stack gap="lg">
          <Heading level={2} size="md">
            Components
          </Heading>
          <ComponentsSpecimen />
        </Stack>
      </Section>
    </>
  );
}
