import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import { Text } from "../typography/Text";
import { icons } from "../../stories/fixtures";

const meta = {
  title: "Atoms/Icon",
  component: Icon,
  args: { icon: icons.spark, size: "lg" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    icon: { control: false },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * An uploaded SVG, drawn as a mask so it takes the colour of the text around
 * it — here the muted text, the link colour and the brand surface.
 */
export const TakesTheTextColour: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Text tone="muted" as="div" className="flex items-center gap-2">
        <Icon icon={icons.leaf} /> In muted text
      </Text>
      <div className="flex items-center gap-2 text-link">
        <Icon icon={icons.bolt} /> In the link colour
      </div>
      <div
        data-surface="brand"
        className="flex items-center gap-2 rounded-theme p-4"
      >
        <Icon icon={icons.spark} /> On the brand surface
      </div>
    </div>
  ),
};
