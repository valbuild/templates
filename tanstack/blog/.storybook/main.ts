import type { StorybookConfig } from "@storybook/react-vite";

/*
 * Storybook for the components under `src/components` and the theme.
 *
 * It builds with `.storybook/vite.config.ts`, not the site's own: the site's
 * config runs TanStack Start, which wants a server and a route tree that a
 * component in isolation has neither of.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  // The site's own public folder, so stories and `/styleguide` share sample images.
  staticDirs: ["../public"],
  framework: { name: "@storybook/react-vite", options: {} },
  core: {
    builder: {
      name: "@storybook/builder-vite",
      options: { viteConfigPath: ".storybook/vite.config.ts" },
    },
    disableTelemetry: true,
  },
};

export default config;
