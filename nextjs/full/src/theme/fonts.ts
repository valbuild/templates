/**
 * The fonts that ship with the template.
 *
 * Self-hosted through Fontsource (imported in `theme.css`), so the site makes
 * no request to Google and works offline. A browser only downloads a font
 * file when text on the page actually uses it, so having five available costs
 * nothing for the four a site does not use.
 *
 * To add one: `npm i @fontsource-variable/<name>`, `@import` it in
 * `theme.css`, add it here, and add its key to the `font` enum of `fontSchema` in
 * `theme.val.ts`.
 */
export const BUNDLED_FONTS = {
  inter: { family: "Inter Variable", fallback: "sans" },
  "plus-jakarta-sans": {
    family: "Plus Jakarta Sans Variable",
    fallback: "sans",
  },
  archivo: { family: "Archivo Variable", fallback: "sans" },
  fraunces: { family: "Fraunces Variable", fallback: "serif" },
  "source-serif-4": { family: "Source Serif 4 Variable", fallback: "serif" },
} as const satisfies Record<string, { family: string; fallback: FontFallback }>;

export type BundledFont = keyof typeof BUNDLED_FONTS;
export type FontFallback = "sans" | "serif" | "mono";

export const FALLBACK_STACKS: Record<FontFallback, string> = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};
