/**
 * The colour maths the theme needs, and nothing else: sRGB hex <-> OKLCH,
 * fitting a colour into sRGB, and WCAG contrast.
 *
 * OKLCH because it is the space where "same lightness, different hue" looks
 * like the same lightness. That is what lets a ramp built from ANY brand
 * colour keep the contrast relationships of the ramp it was modelled on — see
 * `ramp.ts`. Conversions are Björn Ottosson's (https://bottosson.github.io/posts/oklab/).
 */

export type Oklch = { l: number; c: number; h: number };
type LinearRgb = { r: number; g: number; b: number };

function toLinear(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function fromLinear(channel: number): number {
  return channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
}

/** `#rgb` or `#rrggbb`; anything else is `null`. */
export function parseHex(hex: string): LinearRgb | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) {
    return null;
  }
  const digits =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((d) => d + d)
          .join("")
      : match[1];
  return {
    r: toLinear(parseInt(digits.slice(0, 2), 16) / 255),
    g: toLinear(parseInt(digits.slice(2, 4), 16) / 255),
    b: toLinear(parseInt(digits.slice(4, 6), 16) / 255),
  };
}

function toHex({ r, g, b }: LinearRgb): string {
  return (
    "#" +
    [r, g, b]
      .map((channel) =>
        Math.round(Math.min(1, Math.max(0, fromLinear(channel))) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function linearToOklch({ r, g, b }: LinearRgb): Oklch {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return { l: L, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h };
}

function oklchToLinear({ l: L, c, h }: Oklch): LinearRgb {
  const A = c * Math.cos((h * Math.PI) / 180);
  const B = c * Math.sin((h * Math.PI) / 180);
  const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  const s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

export function hexToOklch(hex: string): Oklch | null {
  const rgb = parseHex(hex);
  return rgb ? linearToOklch(rgb) : null;
}

function inGamut({ r, g, b }: LinearRgb): boolean {
  const e = 1e-6;
  return [r, g, b].every((channel) => channel >= -e && channel <= 1 + e);
}

/**
 * The colour as hex, with its chroma reduced until it fits sRGB.
 *
 * Lightness and hue are never touched: lightness is what contrast depends on,
 * and hue is what makes it the editor's colour.
 */
export function oklchToHex(color: Oklch): string {
  if (inGamut(oklchToLinear(color))) {
    return toHex(oklchToLinear(color));
  }
  let low = 0;
  let high = color.c;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (inGamut(oklchToLinear({ ...color, c: mid }))) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return toHex(oklchToLinear({ ...color, c: low }));
}

/** WCAG 2 relative luminance. */
export function luminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

/** WCAG 2 contrast ratio, 1–21. */
export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Normal-size text, WCAG AA. */
export const AA_TEXT = 4.5;

/**
 * `color-mix(in oklab, a pct%, b)`, for checking the contrast of what the
 * browser will draw.
 */
export function mixOklab(a: string, b: string, aPercent: number): string {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) {
    throw new Error(`Not hex colours: ${a}, ${b}`);
  }
  const la = linearToOklch(ca);
  const lb = linearToOklch(cb);
  const t = aPercent / 100;
  const toAB = (c: Oklch) => ({
    l: c.l,
    a: c.c * Math.cos((c.h * Math.PI) / 180),
    b: c.c * Math.sin((c.h * Math.PI) / 180),
  });
  const pa = toAB(la);
  const pb = toAB(lb);
  const l = pa.l * t + pb.l * (1 - t);
  const A = pa.a * t + pb.a * (1 - t);
  const B = pa.b * t + pb.b * (1 - t);
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return oklchToHex({ l, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h });
}
