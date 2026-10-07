import type { StorybookConfig } from "@storybook/nextjs-vite";

/*
 * Storybook for the components under `src/components` and the theme.
 *
 * `@storybook/nextjs-vite` stands in for Next: `next/link`, `next/image` and
 * the router work in a story without a server, and Tailwind runs through this
 * project's own PostCSS config.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  // The site's own public folder, so stories and `/styleguide` share sample images.
  staticDirs: ["../public"],
  framework: { name: "@storybook/nextjs-vite", options: {} },
  core: { disableTelemetry: true },
};

export default config;
