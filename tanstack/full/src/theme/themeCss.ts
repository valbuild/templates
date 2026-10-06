import { FALLBACK_STACKS, BUNDLED_FONTS } from "./fonts";
import {
  awayFrom,
  colorRamp,
  neutralRamp,
  onColor,
  RAMP_STEPS,
  type Ramp,
} from "./ramp";
import { surfaceCss } from "./surfaces";
import type {
  Density,
  FontChoice,
  HeadingWeight,
  Radius,
  Scale,
  Theme,
} from "./types";

/*
 * A resolved theme, as CSS.
 *
 * Two outputs, because CSS custom properties can carry a VALUE but not a
 * BEHAVIOUR:
 *
 * - `themeCss` — variables on `:root`: colours, fonts, sizes, radii. Anything
 *   that is one value in one property.
 * - `themeAttributes` — data attributes for the choices that change several
 *   properties at once, or a hover state (`data-button-style="outline"`).
 *   `theme.css` selects on them.
 *
 * Plus the surfaces (`surfaces.ts`): what each colour means on a given
 * background. They are declared on the element that CHANGES them, not derived
 * once on `:root`, because a variable that refers to another is resolved
 * where it is declared — `--action: var(--brand)` on `:root` could never flip
 * inside a brand section.
 */

const SCALE_RATIO: Record<Scale, number> = {
  compact: 1.2,
  default: 1.25,
  dramatic: 1.333,
};

const HEADING_WEIGHT: Record<HeadingWeight, number> = {
  regular: 400,
  semibold: 600,
  black: 900,
};

const RADIUS: Record<Radius, { base: number; large: number }> = {
  square: { base: 0, large: 0 },
  tight: { base: 0.25, large: 0.375 },
  default: { base: 0.5, large: 0.75 },
  soft: { base: 1, large: 1.5 },
};

/** Vertical padding of a section, on a phone and on a wide screen. */
const DENSITY: Record<
  Density,
  { section: [number, number]; gap: [number, number] }
> = {
  compact: { section: [2.5, 4], gap: [1, 1.25] },
  default: { section: [3.5, 6], gap: [1.25, 2] },
  airy: { section: [4.5, 8], gap: [1.5, 2.75] },
};

const rem = (n: number) => `${Number(n.toFixed(4))}rem`;

/**
 * `min` on a 360px screen, growing linearly to `max` at 1280px, and never
 * past either.
 */
function fluid(min: number, max: number): string {
  if (Math.abs(max - min) < 0.001) {
    return rem(max);
  }
  const slope = (max - min) / (80 - 22.5);
  return `clamp(${rem(min)}, ${rem(min - slope * 22.5)} + ${Number(
    (slope * 100).toFixed(4),
  )}vw, ${rem(max)})`;
}

/**
 * The type scale: step 0 is body text, each step up is `ratio` times the one
 * below. Large steps shrink on small screens — by 40% of what they have over
 * body size — so a dramatic display heading still fits a phone.
 */
function typeScale(scale: Scale): Record<string, string> {
  const ratio = SCALE_RATIO[scale];
  const steps: Record<string, string> = {};
  for (let step = -1; step <= 6; step++) {
    const max = Math.pow(ratio, step);
    const min = step >= 2 ? 1 + (max - 1) * 0.6 : max;
    const name = step < 0 ? `--step-minus-${-step}` : `--step-${step}`;
    steps[name] = fluid(min, max);
  }
  return steps;
}

/** A string safe inside a CSS `"..."` that sits inside a `<style>` element. */
function cssString(value: string): string {
  return `"${value.replace(/[\\"\n\r<>]/g, (ch) => `\\${ch.charCodeAt(0).toString(16)} `)}"`;
}

function fontStack(choice: FontChoice, customFamily: string): string {
  if (choice.type === "bundled") {
    const font = BUNDLED_FONTS[choice.font];
    return `${cssString(font.family)}, ${FALLBACK_STACKS[font.fallback]}`;
  }
  return `${cssString(customFamily)}, ${FALLBACK_STACKS[choice.fallback]}`;
}

function fontFaces(choice: FontChoice, family: string): string[] {
  if (choice.type === "bundled") {
    return [];
  }
  return choice.files.map(
    (file) =>
      `@font-face{font-family:${cssString(family)};src:url(${cssString(file.url)}) format("woff2");font-weight:${file.weight};font-style:${file.style};font-display:swap}`,
  );
}

function rampVars(name: string, ramp: Ramp): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const step of RAMP_STEPS) {
    vars[`--${name}-${step}`] = ramp[step];
  }
  return vars;
}

/** Every variable the theme sets, by name. Exported for the tests. */
export function themeVariables(theme: Theme): Record<string, string> {
  const neutral = neutralRamp(theme.colors.neutral);
  const { brand, accent } = theme.colors;
  const radius = RADIUS[theme.base.radius];
  const density = DENSITY[theme.base.density];
  const { typography, atoms } = theme;
  const onBrand = onColor(brand, neutral[950]);
  const uppercaseTracking = "0.04em";
  return {
    "--brand": brand,
    "--on-brand": onBrand,
    "--brand-shade": awayFrom(onBrand),
    ...rampVars("brand", colorRamp(brand)),
    "--accent": accent,
    "--on-accent": onColor(accent, neutral[950]),
    ...rampVars("accent", colorRamp(accent)),
    ...rampVars("n", neutral),

    "--theme-font-heading": fontStack(typography.heading, "Theme Heading"),
    "--theme-font-body": fontStack(typography.body, "Theme Body"),
    "--heading-weight": String(HEADING_WEIGHT[typography.headingWeight]),
    "--heading-case":
      typography.headingCase === "uppercase" ? "uppercase" : "none",
    "--heading-tracking":
      typography.headingCase === "uppercase"
        ? "0.01em"
        : typography.headingWeight === "black"
          ? "-0.03em"
          : "-0.015em",
    "--eyebrow-case":
      typography.eyebrowCase === "uppercase" ? "uppercase" : "none",
    "--eyebrow-tracking":
      typography.eyebrowCase === "uppercase" ? "0.12em" : "0",
    ...typeScale(typography.scale),

    "--button-radius":
      atoms.button.shape === "pill"
        ? "999px"
        : atoms.button.shape === "square"
          ? "0"
          : rem(Math.max(radius.base, 0.375)),
    "--button-case": atoms.button.case === "uppercase" ? "uppercase" : "none",
    "--button-tracking":
      atoms.button.case === "uppercase" ? uppercaseTracking : "0",

    "--radius": rem(radius.base),
    "--radius-lg": rem(radius.large),
    "--space-section": fluid(...density.section),
    "--space-gap": fluid(...density.gap),
    "--shadow-raised":
      "0 1px 2px light-dark(rgb(0 0 0/0.06),rgb(0 0 0/0.4)),0 8px 24px light-dark(rgb(0 0 0/0.08),rgb(0 0 0/0.5))",
  };
}

const COLOR_SCHEME: Record<Theme["mode"], string> = {
  system: "light dark",
  light: "light",
  dark: "dark",
};

/** The `<style>` the site renders. */
export function themeCss(theme: Theme): string {
  const declarations = Object.entries(themeVariables(theme))
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
  return [
    `:root{color-scheme:${COLOR_SCHEME[theme.mode]};${declarations}}`,
    surfaceCss(),
    ...fontFaces(theme.typography.heading, "Theme Heading"),
    ...fontFaces(theme.typography.body, "Theme Body"),
  ].join("\n");
}

/** The attributes for the element the site renders inside. */
export function themeAttributes(theme: Theme): Record<string, string> {
  return {
    "data-button-style": theme.atoms.button.style,
    "data-link-underline": theme.atoms.link.underline,
    "data-card-style": theme.base.card.style,
  };
}
