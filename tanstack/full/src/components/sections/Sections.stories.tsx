import type { Meta, StoryObj } from "@storybook/react-vite";
import { TitleTextSection } from "./TitleTextSection";
import { ImageTextSection } from "./ImageTextSection";
import { landscape, sampleProse, text } from "../../stories/fixtures";

const meta = {
  title: "Sections",
  parameters: { pad: false },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleText: Story = {
  render: () => (
    <TitleTextSection
      type="title-text"
      surface="default"
      title={text("This page is built using Val")}
      text={sampleProse}
      buttons={[
        {
          type: "external",
          label: text("Open Val Studio"),
          href: text("/val"),
          variant: "primary",
        },
        {
          type: "external",
          label: text("Read the docs"),
          href: text("https://val.build/docs"),
          variant: "secondary",
        },
      ]}
    />
  ),
};

export const TitleTextOnBrand: Story = {
  render: () => (
    <TitleTextSection
      type="title-text"
      surface="brand"
      title={text("How Val works")}
      text={sampleProse}
      buttons={[
        {
          type: "external",
          label: text("Val Admin"),
          href: text("https://admin.val.build"),
          variant: "primary",
        },
      ]}
    />
  ),
};

export const ImageText: Story = {
  render: () => (
    <ImageTextSection
      type="image-text"
      surface="muted"
      title={text("An image beside the text")}
      text={sampleProse}
      image={landscape}
    />
  ),
};
