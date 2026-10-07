import type { Meta, StoryObj } from "@storybook/react";
import {
  ComponentsSpecimen,
  PaletteSpecimen,
  Styleguide,
  SurfacesSpecimen,
  TypeSpecimen,
} from "./Styleguide";

const meta = {
  title: "Overview",
  parameters: {
    docs: {
      description: {
        component:
          "Switch the preset and the mode in the toolbar: every story is drawn by the same theme the site uses.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The whole system on one page. On the site this is `/styleguide`. */
export const StyleGuide: Story = {
  render: () => <Styleguide />,
  parameters: { pad: false },
};

/**
 * One brand colour becomes eleven shades; the exact colour is kept for fills.
 * The neutral ramp is tinted cool, neutral or warm.
 */
export const Colour: Story = { render: () => <PaletteSpecimen /> };

/**
 * What a section can sit on. Everything inside reads the surface's tokens, so
 * a primary button on the brand surface inverts instead of vanishing.
 */
export const Surfaces: Story = { render: () => <SurfacesSpecimen /> };

export const Type: Story = { render: () => <TypeSpecimen /> };

export const Components: Story = { render: () => <ComponentsSpecimen /> };
