import { AA_TEXT, contrast, hexToOklch, oklchToHex } from "./color";

/**
 * A colour ramp: eleven steps from almost white (50) to almost black (950).
 *
 * The theme never asks an editor for more than one colour per role. Every
 * tint, border, text colour and dark-mode variant is a step of a ramp built
 * from that one colour, so there is nothing to keep in sync and nothing to get
 * wrong.
 *
 * ## Why any colour is safe
 *
 * Each step has a FIXED lightness, taken from a ramp that was tuned by eye;
 * only the hue and chroma come from the editor's colour. Contrast depends
 * almost entirely on lightness, so a ramp built from any hue keeps the
 * contrast of the one it was modelled on. "Almost" is why `theme.test.ts`
 * sweeps the whole hue circle instead of trusting the argument.
 *
 * The editor's exact colour is still used, as `--brand` itself, for fills: a
 * button or a brand section is the colour they picked. Text on it is whichever
 * of white or near black reads better — and one of them always clears AA,
 * because the two meet at a luminance where both are above 4.5:1.
 */

export const RAMP_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;
export type RampStep = (typeof RAMP_STEPS)[number];
export type Ramp = Record<RampStep, string>;

/** Lightness of each step of a coloured ramp. */
const COLOR_LIGHTNESS: Record<RampStep, number> = {
  50: 0.975,
  100: 0.945,
  200: 0.89,
  300: 0.82,
  400: 0.73,
  500: 0.64,
  600: 0.56,
  700: 0.49,
  800: 0.42,
  900: 0.36,
  950: 0.28,
};

/**
 * How much of the colour's own chroma each step keeps. Full in the middle,
 * where the colour is recognisably itself; less towards white and black, where
 * full chroma reads as neon or mud.
 */
const COLOR_CHROMA: Record<RampStep, number> = {
  50: 0.15,
  100: 0.3,
  200: 0.5,
  300: 0.75,
  400: 0.95,
  500: 1,
  600: 1,
  700: 0.9,
  800: 0.75,
  900: 0.6,
  950: 0.45,
};

/** Lightness of each step of the neutral (grey) ramp. */
const NEUTRAL_LIGHTNESS: Record<RampStep, number> = {
  50: 0.985,
  100: 0.967,
  200: 0.922,
  300: 0.87,
  400: 0.708,
  500: 0.556,
  600: 0.439,
  700: 0.371,
  800: 0.269,
  900: 0.205,
  950: 0.145,
};

export type NeutralTone = "cool" | "neutral" | "warm";

/** A hint of hue in the greys: blue-ish, none, or sand-ish. */
const NEUTRAL_TINT: Record<NeutralTone, { c: number; h: number }> = {
  cool: { c: 0.012, h: 255 },
  neutral: { c: 0, h: 0 },
  warm: { c: 0.012, h: 75 },
};

function mapSteps(fn: (step: RampStep) => string): Ramp {
  return {
    50: fn(50),
    100: fn(100),
    200: fn(200),
    300: fn(300),
    400: fn(400),
    500: fn(500),
    600: fn(600),
    700: fn(700),
    800: fn(800),
    900: fn(900),
    950: fn(950),
  };
}

export function colorRamp(hex: string): Ramp {
  const base = hexToOklch(hex) ?? { l: 0.5, c: 0, h: 0 };
  return mapSteps((step) =>
    oklchToHex({
      l: COLOR_LIGHTNESS[step],
      c: base.c * COLOR_CHROMA[step],
      h: base.h,
    }),
  );
}

export function neutralRamp(tone: NeutralTone): Ramp {
  const tint = NEUTRAL_TINT[tone];
  return mapSteps((step) =>
    oklchToHex({ l: NEUTRAL_LIGHTNESS[step], c: tint.c, h: tint.h }),
  );
}

/**
 * The text colour for a fill of `hex`: white where white reads, otherwise the
 * darkest neutral, and — for the narrow band of mid-luminance colours where
 * neither quite makes it — pure black, which always does.
 */
export function onColor(hex: string, darkest: string): string {
  for (const candidate of ["#ffffff", darkest]) {
    if (contrast(hex, candidate) >= AA_TEXT) {
      return candidate;
    }
  }
  return "#000000";
}

/**
 * The extreme on the OTHER side of `text` from a fill: black if the text on
 * the fill is white, white otherwise. Mixing a little of it into the fill
 * makes a second shade of that colour that can only be MORE legible under the
 * same text — which is how the brand surface gets a "subtle" background.
 */
export function awayFrom(text: string): string {
  return text === "#ffffff" ? "#000000" : "#ffffff";
}
