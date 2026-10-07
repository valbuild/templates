import type { Decorator, Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";
import { PRESET_NAMES } from "../src/theme/presets";
import { presetTheme } from "../src/theme/resolveTheme";
import { ThemeRoot } from "../src/theme/ThemeRoot";
import type { PresetName } from "../src/theme/types";

function isPreset(value: unknown): value is PresetName {
  return PRESET_NAMES.some((name) => name === value);
}

/**
 * Every story inside a theme: the preset and the mode come from the toolbar.
 * This is the same `ThemeRoot` the site renders, given a preset instead of the
 * content of `theme.val.ts`.
 */
const withTheme: Decorator = (Story, context) => {
  const preset = isPreset(context.globals.preset)
    ? context.globals.preset
    : "clean";
  const mode = context.globals.mode === "dark" ? "dark" : "light";
  return (
    <ThemeRoot
      theme={presetTheme(preset, mode)}
      className={context.parameters.pad === false ? "" : "p-6 sm:p-10"}
    >
      <Story />
    </ThemeRoot>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    preset: {
      description: "Theme preset",
      toolbar: {
        title: "Preset",
        icon: "paintbrush",
        items: PRESET_NAMES.map((name) => ({ value: name, title: name })),
        dynamicTitle: true,
      },
    },
    mode: {
      description: "Light or dark",
      toolbar: {
        title: "Mode",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { preset: "clean", mode: "light" },
  parameters: {
    // The theme root draws the page, so Storybook's own padding stays off.
    // A story sets `pad: false` to go edge to edge (sections do).
    layout: "fullscreen",
    controls: { expanded: true },
    /*
     * Not `nextjs: { appDirectory: true }`: the components here use only
     * `next/link` and `next/image`, which need no App Router, and Storybook's
     * App Router stand-in (10.6) is missing context that Next 16.4's
     * `useRouter` reads, so every story would crash with "reading 'data'".
     */
    options: {
      storySort: {
        order: ["Overview", "Typography", "Atoms", "Base", "Sections"],
      },
    },
  },
};

export default preview;
