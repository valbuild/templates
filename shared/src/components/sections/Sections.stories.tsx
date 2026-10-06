import type { Meta, StoryObj } from "@storybook/react-vite";
import { TitleTextSection } from "./TitleTextSection";
import { ImageTextSection } from "./ImageTextSection";
import { HeroSection } from "./HeroSection";
import type { HeroSectionSchema } from "./heroSection.val";
import { CardGridSection } from "./CardGridSection";
import { MediaCarouselSection } from "./MediaCarouselSection";
import { AccordionSection } from "./AccordionSection";
import {
  landscape,
  landscapeMedia,
  portrait,
  sampleProse,
  square,
  text,
} from "../../stories/fixtures";

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
      imageSide="left"
    />
  ),
};

const buttons: HeroSectionSchema["buttons"] = [
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
];

/** With a background image: the text switches to light over a darkened image. */
export const Hero: Story = {
  render: () => (
    <HeroSection
      type="hero"
      eyebrow={text("Val + TanStack Start")}
      title={text("Content as code, edited like a website")}
      intro={text(
        "Everything on this page lives in your repository, and every word can be changed in Val Studio.",
      )}
      buttons={buttons}
      background={landscapeMedia}
      surface="default"
    />
  ),
};

/** No background: the hero sits on its surface. Without buttons it is the minimal hero. */
export const HeroOnBrand: Story = {
  render: () => (
    <HeroSection
      type="hero"
      eyebrow={null}
      title={text("A hero on the brand surface")}
      intro={text("The same section with the background left empty.")}
      buttons={buttons}
      background={null}
      surface="brand"
    />
  ),
};

export const CardGrid: Story = {
  render: () => (
    <CardGridSection
      type="card-grid"
      eyebrow={text("Why Val")}
      title={text("A CMS that lives where your code does")}
      intro={null}
      columns="3"
      surface="default"
      cards={[landscape, square, portrait].map((image, index) => ({
        image,
        tag: text(["Local first", "Visual editing", "Themeable"][index]),
        title: text(
          [
            "Your content is in your repository",
            "Click the page to change it",
            "The look is content too",
          ][index],
        ),
        text: text(
          "Typed by schemas, reviewed in pull requests and versioned with Git.",
        ),
        link: {
          type: "external",
          label: text("Read more"),
          href: text("https://val.build/docs"),
        },
      }))}
    />
  ),
};

export const ImageOnTheRight: Story = {
  render: () => (
    <ImageTextSection
      type="image-text"
      surface="default"
      title={text("The image can go on either side")}
      text={sampleProse}
      image={square}
      imageSide="right"
    />
  ),
};

/** Scrolls by swipe, trackpad or keyboard; the buttons step one slide. */
export const MediaCarousel: Story = {
  render: () => (
    <MediaCarouselSection
      type="media-carousel"
      eyebrow={text("Gallery")}
      title={text("Images from the Studio")}
      intro={text(
        "Set a focal point once and it stays in frame however the layout crops it.",
      )}
      surface="muted"
      slides={[landscape, square, portrait, landscape].map((image, index) => ({
        image,
        caption: text(`Slide ${index + 1}`),
      }))}
    />
  ),
};

/** Native `<details>`: opens without JavaScript, one at a time if asked. */
export const Accordion: Story = {
  render: () => (
    <AccordionSection
      type="accordion"
      eyebrow={text("Questions")}
      title={text("Before you start")}
      intro={null}
      oneAtATime
      surface="default"
      items={[
        "Do I need an account to try Val?",
        "Where is the content stored?",
        "Can people who do not write code edit the site?",
      ].map((question) => ({ question: text(question), answer: sampleProse }))}
    />
  ),
};
