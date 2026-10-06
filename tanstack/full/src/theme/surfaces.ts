/*
 * Surfaces: what each colour MEANS on a given background.
 *
 * A section picks a surface (`data-surface="brand"`), and everything inside it
 * — text, links, buttons, tags — reads the surface's tokens, so it is legible
 * without knowing where it is. That is why a button in a brand-coloured
 * section can never be brand on brand.
 *
 * This table is the single definition: `themeCss` writes it out as CSS, and
 * `theme.test.ts` checks every text/background pair in it against WCAG AA for
 * every brand colour. Change a token here and the test follows.
 *
 * Why it is written at runtime and not in `theme.css`: the light/dark values
 * use `light-dark()`, which Tailwind's production build (Lightning CSS)
 * rewrites into a polyfill driven by the `color-scheme` declarations IT has
 * seen. Our `color-scheme` comes from content, at runtime, so the polyfill
 * would never switch on and every `light-dark()` would resolve to nothing.
 */

export type Surface = "default" | "muted" | "brand" | "inverse";

/** A colour variable by name, without the `--`: `"n-50"`, `"brand"`. */
type Ref = string;

export type TokenValue =
  | { kind: "ref"; ref: Ref }
  | { kind: "lightDark"; light: Ref; dark: Ref }
  | { kind: "mix"; a: Ref; aPercent: number; b: Ref };

export type SurfaceToken =
  | "bg"
  | "fg"
  | "fg-muted"
  | "border"
  | "subtle"
  | "link"
  | "action"
  | "on-action"
  | "tint"
  | "on-tint"
  | "highlight"
  | "highlight-tint"
  | "on-highlight-tint"
  | "raised";

const ref = (r: Ref): TokenValue => ({ kind: "ref", ref: r });
const ld = (light: Ref, dark: Ref): TokenValue => ({
  kind: "lightDark",
  light,
  dark,
});
const mix = (a: Ref, aPercent: number, b: Ref): TokenValue => ({
  kind: "mix",
  a,
  aPercent,
  b,
});

const DEFAULT: Record<SurfaceToken, TokenValue> = {
  bg: ld("n-50", "n-950"),
  fg: ld("n-950", "n-50"),
  "fg-muted": ld("n-600", "n-400"),
  border: ld("n-200", "n-800"),
  subtle: ld("n-100", "n-900"),
  link: ld("brand-700", "brand-300"),
  action: ref("brand"),
  "on-action": ref("on-brand"),
  tint: ld("brand-100", "brand-900"),
  "on-tint": ld("brand-900", "brand-100"),
  highlight: ld("accent-700", "accent-300"),
  "highlight-tint": ld("accent-100", "accent-900"),
  "on-highlight-tint": ld("accent-800", "accent-200"),
  // A raised card: the page colour in light mode, where a shadow carries it,
  // and a step lighter in dark mode, where a shadow cannot.
  raised: ld("n-50", "n-900"),
};

export const SURFACES: Record<Surface, Record<SurfaceToken, TokenValue>> = {
  default: DEFAULT,
  muted: {
    ...DEFAULT,
    bg: ld("n-100", "n-900"),
    subtle: ld("n-200", "n-800"),
    border: ld("n-300", "n-700"),
    raised: ld("n-50", "n-800"),
  },
  inverse: {
    bg: ld("n-950", "n-50"),
    fg: ld("n-50", "n-950"),
    "fg-muted": ld("n-400", "n-600"),
    border: ld("n-800", "n-200"),
    subtle: ld("n-900", "n-100"),
    link: ld("brand-300", "brand-700"),
    action: ref("brand"),
    "on-action": ref("on-brand"),
    tint: ld("brand-900", "brand-100"),
    "on-tint": ld("brand-100", "brand-900"),
    highlight: ld("accent-300", "accent-700"),
    "highlight-tint": ld("accent-900", "accent-100"),
    "on-highlight-tint": ld("accent-200", "accent-800"),
    raised: ld("n-900", "n-100"),
  },
  /*
   * The editor's exact brand colour, in both modes. Text is the one colour
   * guaranteed to read on it; anything "softer" would be a guess, so muted
   * text is the same, and the things that are usually tinted (soft buttons,
   * tags) invert instead.
   */
  brand: {
    bg: ref("brand"),
    fg: ref("on-brand"),
    "fg-muted": ref("on-brand"),
    border: mix("on-brand", 30, "brand"),
    // Towards the side AWAY from the text, so text on it only gains contrast.
    subtle: mix("brand-shade", 14, "brand"),
    link: ref("on-brand"),
    action: ref("on-brand"),
    "on-action": ref("brand"),
    tint: ref("on-brand"),
    "on-tint": ref("brand"),
    highlight: ref("on-brand"),
    "highlight-tint": ref("on-brand"),
    "on-highlight-tint": ref("brand"),
    raised: mix("brand-shade", 14, "brand"),
  },
};

/** The pairs that carry text: [text, background]. */
export const TEXT_PAIRS: [SurfaceToken, SurfaceToken][] = [
  ["fg", "bg"],
  ["fg-muted", "bg"],
  ["fg-muted", "subtle"],
  ["link", "bg"],
  ["highlight", "bg"],
  ["on-action", "action"],
  ["on-tint", "tint"],
  ["on-highlight-tint", "highlight-tint"],
  ["fg", "raised"],
  ["fg-muted", "raised"],
  ["link", "raised"],
];

function css(value: TokenValue): string {
  switch (value.kind) {
    case "ref":
      return `var(--${value.ref})`;
    case "lightDark":
      return `light-dark(var(--${value.light}),var(--${value.dark}))`;
    case "mix":
      return `color-mix(in oklab,var(--${value.a}) ${value.aPercent}%,var(--${value.b}))`;
  }
}

function declarations(tokens: Record<SurfaceToken, TokenValue>): string {
  return Object.entries(tokens)
    .map(([name, value]) => `--${name}:${css(value)}`)
    .join(";");
}

/** The surfaces as CSS. `:root` is the default surface. */
export function surfaceCss(): string {
  return [
    `:root,[data-surface="default"]{${declarations(SURFACES.default)}}`,
    `[data-surface="muted"]{${declarations(SURFACES.muted)}}`,
    `[data-surface="inverse"]{${declarations(SURFACES.inverse)}}`,
    `[data-surface="brand"]{${declarations(SURFACES.brand)}}`,
  ].join("\n");
}
