import type { Preset, PresetName } from "./types";

/**
 * Four starting points, each pushing the theme's dials a different way.
 *
 * They double as the test of the theme itself: if the system can produce four
 * sites this different, it is expressive enough. When two presets start to
 * look alike, a dial is missing.
 *
 * Presets are code, not content. An editor picks one and overrides what they
 * like in `theme.val.ts`; a new preset is a developer's job.
 */
export const PRESETS: Record<PresetName, Preset> = {
  /** Product, SaaS, docs: quiet, precise, nothing in the way. */
  clean: {
    colors: { brand: "#2563eb", accent: "#0891b2", neutral: "cool" },
    typography: {
      heading: { type: "bundled", font: "inter" },
      body: { type: "bundled", font: "inter" },
      scale: "default",
      headingCase: "normal",
      headingWeight: "semibold",
      eyebrowCase: "uppercase",
    },
    atoms: {
      button: { shape: "rounded", style: "solid", case: "normal" },
      link: { underline: "hover" },
    },
    base: {
      radius: "default",
      density: "default",
      card: { style: "outlined" },
    },
  },
  /** Magazine, journal, studio: type first, lots of air, hairlines. */
  editorial: {
    colors: { brand: "#9f1d20", accent: "#b45309", neutral: "warm" },
    typography: {
      heading: { type: "bundled", font: "fraunces" },
      body: { type: "bundled", font: "source-serif-4" },
      scale: "dramatic",
      headingCase: "normal",
      headingWeight: "regular",
      eyebrowCase: "uppercase",
    },
    atoms: {
      button: { shape: "square", style: "outline", case: "normal" },
      link: { underline: "always" },
    },
    base: { radius: "square", density: "airy", card: { style: "flat" } },
  },
  /** Agency, launch, event: loud type, strong colour, tight spacing. */
  bold: {
    colors: { brand: "#6d28d9", accent: "#e11d48", neutral: "neutral" },
    typography: {
      heading: { type: "bundled", font: "archivo" },
      body: { type: "bundled", font: "inter" },
      scale: "dramatic",
      headingCase: "uppercase",
      headingWeight: "black",
      eyebrowCase: "uppercase",
    },
    atoms: {
      button: { shape: "square", style: "solid", case: "uppercase" },
      link: { underline: "never" },
    },
    base: { radius: "tight", density: "compact", card: { style: "flat" } },
  },
  /** Community, café, non-profit: round, warm, friendly. */
  soft: {
    colors: { brand: "#4d7c63", accent: "#d97757", neutral: "warm" },
    typography: {
      heading: { type: "bundled", font: "plus-jakarta-sans" },
      body: { type: "bundled", font: "plus-jakarta-sans" },
      scale: "default",
      headingCase: "normal",
      headingWeight: "semibold",
      eyebrowCase: "normal",
    },
    atoms: {
      button: { shape: "pill", style: "solid", case: "normal" },
      link: { underline: "hover" },
    },
    base: { radius: "soft", density: "airy", card: { style: "raised" } },
  },
};

export const PRESET_NAMES: PresetName[] = [
  "clean",
  "editorial",
  "bold",
  "soft",
];
