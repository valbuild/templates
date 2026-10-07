import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";
import { Divider } from "./Divider";

const meta = {
  title: "Atoms/Tag",
  component: Tag,
  args: { children: "New" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In the accent colour: a highlight, not a button. */
export const Default: Story = {};

export const Several: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag>Design</Tag>
      <Tag>Engineering</Tag>
      <Tag>Content</Tag>
    </div>
  ),
};

export const WithDivider: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Tag>Above</Tag>
      <Divider />
      <Tag>Below</Tag>
    </div>
  ),
};
