import type { Meta, StoryObj } from "@storybook/react";
import { Media, type MediaAspect } from "./Media";
import {
  duskMedia,
  landscapeMedia,
  portraitMedia,
} from "../../stories/fixtures";

const meta = {
  title: "Atoms/Media",
  component: Media,
  args: { media: landscapeMedia, aspect: "wide", rounded: true },
  argTypes: {
    aspect: {
      control: "inline-radio",
      options: ["auto", "square", "landscape", "wide", "portrait"],
    },
    media: { control: false },
  },
} satisfies Meta<typeof Media>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <Media {...args} />
    </div>
  ),
};

const ASPECTS: MediaAspect[] = ["wide", "landscape", "square", "portrait"];

/**
 * One image in every aspect. The editor's focal point (here: the sun) stays
 * in frame however hard it is cropped.
 */
export const FocalPoint: Story = {
  render: () => (
    <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-4">
      {ASPECTS.map((aspect) => (
        <Media key={aspect} media={landscapeMedia} aspect={aspect} />
      ))}
    </div>
  ),
};

export const Portrait: Story = {
  args: { media: portraitMedia, aspect: "portrait" },
  render: (args) => (
    <div className="max-w-xs">
      <Media {...args} />
    </div>
  ),
};

/** A video from the video library: muted and looping, a moving picture. */
export const Video: Story = {
  args: { media: duskMedia, aspect: "wide" },
  render: (args) => (
    <div className="max-w-2xl">
      <Media {...args} />
    </div>
  ),
};
