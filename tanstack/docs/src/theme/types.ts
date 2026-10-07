import type { BundledFont, FontFallback } from "./fonts";
import type { NeutralTone } from "./ramp";

/*
 * The theme, fully decided: every choice has a value.
 *
 * `theme.val.ts` is the same shape with every field nullable — null meaning
 * "what the preset says" — and `resolveTheme` turns one into the other. Nothing
 * below this file ever sees a null.
 */

export type PresetName = "clean" | "editorial" | "bold" | "soft";
export type Mode = "system" | "light" | "dark";
export type Scale = "compact" | "default" | "dramatic";
export type TextCase = "normal" | "uppercase";
export type HeadingWeight = "regular" | "semibold" | "black";
export type ButtonShape = "square" | "rounded" | "pill";
export type ButtonStyle = "solid" | "outline" | "soft";
export type LinkUnderline = "always" | "hover" | "never";
export type Radius = "square" | "tight" | "default" | "soft";
export type Density = "compact" | "default" | "airy";
export type CardStyle = "flat" | "outlined" | "raised";

export type CustomFontFile = {
  url: string;
  weight: number;
  style: "normal" | "italic";
};

export type FontChoice =
  | { type: "bundled"; font: BundledFont }
  | { type: "custom"; fallback: FontFallback; files: CustomFontFile[] };

export type Theme = {
  mode: Mode;
  toggle: boolean;
  colors: {
    /** A hex colour. */
    brand: string;
    /** A hex colour. */
    accent: string;
    neutral: NeutralTone;
  };
  typography: {
    heading: FontChoice;
    body: FontChoice;
    scale: Scale;
    headingCase: TextCase;
    headingWeight: HeadingWeight;
    eyebrowCase: TextCase;
  };
  atoms: {
    button: { shape: ButtonShape; style: ButtonStyle; case: TextCase };
    link: { underline: LinkUnderline };
  };
  base: {
    radius: Radius;
    density: Density;
    card: { style: CardStyle };
  };
};

/** What a preset decides: everything except how the site opens. */
export type Preset = Omit<Theme, "mode" | "toggle">;
