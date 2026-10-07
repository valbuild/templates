import { test } from "node:test";
import assert from "node:assert/strict";
import { AA_TEXT, contrast, mixOklab, oklchToHex } from "./color";
import { PRESET_NAMES } from "./presets";
import { awayFrom, colorRamp, neutralRamp, onColor, type Ramp } from "./ramp";
import { SURFACES, TEXT_PAIRS, type TokenValue } from "./surfaces";
import { presetTheme, resolveTheme } from "./resolveTheme";
import { themeCss } from "./themeCss";
import type { Theme } from "./types";

/*
 * The promise the theme makes: whatever brand and accent colour an editor
 * picks, every piece of text on every surface clears WCAG AA, in light and in
 * dark. The surfaces and the pairs that carry text both come from
 * `surfaces.ts`, the same table the CSS is written from.
 */

type Mode = "light" | "dark";

function variables(theme: Theme): Record<string, string> {
  const n = neutralRamp(theme.colors.neutral);
  const vars: Record<string, string> = {
    brand: theme.colors.brand,
    "on-brand": onColor(theme.colors.brand, n[950]),
    "brand-shade": awayFrom(onColor(theme.colors.brand, n[950])),
    accent: theme.colors.accent,
    "on-accent": onColor(theme.colors.accent, n[950]),
  };
  const ramps: [string, Ramp][] = [
    ["n", n],
    ["brand", colorRamp(theme.colors.brand)],
    ["accent", colorRamp(theme.colors.accent)],
  ];
  for (const [name, ramp] of ramps) {
    for (const [step, hex] of Object.entries(ramp)) {
      vars[`${name}-${step}`] = hex;
    }
  }
  return vars;
}

function resolve(
  value: TokenValue,
  vars: Record<string, string>,
  mode: Mode,
): string {
  const get = (ref: string) => {
    const hex = vars[ref];
    assert.ok(hex, `no variable --${ref}`);
    return hex;
  };
  switch (value.kind) {
    case "ref":
      return get(value.ref);
    case "lightDark":
      return get(mode === "light" ? value.light : value.dark);
    case "mix":
      return mixOklab(get(value.a), get(value.b), value.aPercent);
  }
}

function failures(theme: Theme): string[] {
  const vars = variables(theme);
  const out: string[] = [];
  for (const mode of ["light", "dark"] as const) {
    for (const [surface, tokens] of Object.entries(SURFACES)) {
      for (const [fgToken, bgToken] of TEXT_PAIRS) {
        const fg = resolve(tokens[fgToken], vars, mode);
        const bg = resolve(tokens[bgToken], vars, mode);
        const ratio = contrast(fg, bg);
        if (ratio < AA_TEXT) {
          out.push(
            `${mode} ${surface} ${fgToken} on ${bgToken}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1`,
          );
        }
      }
    }
  }
  return out;
}

test("every preset clears AA in both modes", () => {
  for (const name of PRESET_NAMES) {
    assert.deepEqual(failures(presetTheme(name)), [], name);
  }
});

test("any brand and accent colour clears AA", () => {
  const problems: string[] = [];
  for (const neutral of ["cool", "neutral", "warm"] as const) {
    for (let h = 0; h < 360; h += 10) {
      for (const [l, c] of [
        [0.3, 0.1],
        [0.5, 0.2],
        [0.62, 0.25],
        [0.75, 0.15],
        [0.85, 0.12],
        [0.95, 0.05],
      ]) {
        const color = oklchToHex({ l, c, h });
        const theme = presetTheme("clean");
        theme.colors = { brand: color, accent: color, neutral };
        problems.push(
          ...failures(theme).map((f) => `${color} (${neutral}): ${f}`),
        );
      }
    }
  }
  assert.deepEqual(problems.slice(0, 20), []);
});

test("empty fields follow the preset; set fields win", () => {
  const theme = resolveTheme({
    preset: "editorial",
    appearance: { mode: "dark", toggle: null },
    colors: { brand: "#ff0000", accent: null, neutral: null },
    typography: {
      heading: null,
      body: { type: "bundled", font: "inter" },
      scale: null,
      headingCase: null,
      headingWeight: null,
      eyebrowCase: null,
    },
    atoms: {
      button: { shape: "pill", style: null, case: null },
      link: { underline: null },
    },
    base: { radius: null, density: null, card: { style: null } },
  });
  assert.equal(theme.mode, "dark");
  assert.equal(theme.toggle, true);
  assert.equal(theme.colors.brand, "#ff0000");
  assert.equal(theme.colors.neutral, "warm");
  assert.deepEqual(theme.typography.heading, {
    type: "bundled",
    font: "fraunces",
  });
  assert.deepEqual(theme.typography.body, { type: "bundled", font: "inter" });
  assert.equal(theme.atoms.button.shape, "pill");
  assert.equal(theme.atoms.button.style, "outline");
});

test("content cannot break out of the <style> element", () => {
  const theme = resolveTheme({
    preset: "clean",
    appearance: { mode: null, toggle: null },
    colors: {
      brand: "</style><script>alert(1)</script>",
      accent: null,
      neutral: null,
    },
    typography: {
      heading: {
        type: "custom",
        fallback: "sans",
        files: [
          {
            file: { url: '/x.woff2"</style><script>' },
            weight: 400,
            style: "normal",
          },
        ],
      },
      body: null,
      scale: null,
      headingCase: null,
      headingWeight: null,
      eyebrowCase: null,
    },
    atoms: {
      button: { shape: null, style: null, case: null },
      link: { underline: null },
    },
    base: { radius: null, density: null, card: { style: null } },
  });
  const css = themeCss(theme);
  assert.equal(css.includes("<"), false);
  assert.equal(theme.colors.brand, "#2563eb");
});
