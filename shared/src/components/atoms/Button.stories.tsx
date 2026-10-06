import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { LinkButton } from "./LinkButton";
import { SurfaceSample } from "../../styleguide/Styleguide";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Get started", variant: "primary", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Shape (square, rounded, pill), case and how primary is drawn (solid,
 * outline, soft) are the theme's — try the presets.
 */
export const Primary: Story = {};

export const Secondary: Story = { args: { variant: "secondary" } };

export const Large: Story = { args: { size: "lg" } };

export const Pair: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Get started</Button>
      <Button variant="secondary">Learn more</Button>
    </div>
  ),
};

/** A link drawn as a button. Internal paths navigate without a page load. */
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <LinkButton href="/">Internal</LinkButton>
      <LinkButton href="https://val.build" variant="secondary">
        External
      </LinkButton>
    </div>
  ),
};

/** The same two buttons on every surface. */
export const OnSurfaces: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <SurfaceSample surface="default" />
      <SurfaceSample surface="muted" />
      <SurfaceSample surface="brand" />
      <SurfaceSample surface="inverse" />
    </div>
  ),
};
