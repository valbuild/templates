import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Eyebrow } from "./Eyebrow";
import { Caption } from "./Caption";
import { Prose } from "./Prose";
import { TextLink } from "./TextLink";
import { sampleProse } from "../../stories/fixtures";

const meta = {
  title: "Typography/Heading",
  component: Heading,
  args: { level: 2, children: "A heading in the site's type" },
  argTypes: {
    level: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    size: {
      control: "inline-radio",
      options: [undefined, "display", "xl", "lg", "md", "sm", "xs"],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Level is the outline; size is the look. Leave size empty to follow the level. */
export const Default: Story = {};

export const Display: Story = { args: { level: 1, size: "display" } };

/** Same `h2`, drawn small: what a card title in a list would do. */
export const SmallH2: Story = { args: { level: 2, size: "sm" } };

export const BodyText: StoryObj<typeof Text> = {
  render: () => (
    <div className="flex max-w-prose flex-col gap-4">
      <Text size="lg">A lead paragraph, one step up from running text.</Text>
      <Text>
        Running text, with <TextLink href="#">a link</TextLink> styled by the
        theme&apos;s underline choice.
      </Text>
      <Text tone="muted">Muted text, for the secondary line.</Text>
      <Text size="sm" tone="muted">
        Small print.
      </Text>
    </div>
  ),
};

export const EyebrowAndCaption: StoryObj<typeof Eyebrow> = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Eyebrow>Case study</Eyebrow>
      <Heading level={2}>With an eyebrow above</Heading>
      <Caption>A caption, as it sits under an image.</Caption>
    </div>
  ),
};

/** Rich text from Val, drawn with `Heading`, `Text` and `TextLink`. */
export const RichText: StoryObj<typeof Prose> = {
  render: () => (
    <div className="max-w-prose">
      <Prose value={sampleProse} />
    </div>
  ),
};
