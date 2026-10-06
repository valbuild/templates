import { parseHex } from "./color";
import type { FontFallback, BundledFont } from "./fonts";
import { PRESETS } from "./presets";
import type { NeutralTone } from "./ramp";
import type {
  ButtonShape,
  ButtonStyle,
  CardStyle,
  Density,
  FontChoice,
  HeadingWeight,
  LinkUnderline,
  Mode,
  PresetName,
  Radius,
  Scale,
  TextCase,
  Theme,
} from "./types";

/**
 * `theme.val.ts` as read, with the stega encoding taken off (`val.raw`):
 * the same shape as {@link Theme}, plus a preset, with every choice nullable.
 *
 * Written out rather than imported from the schema so this file — and the
 * tests — need nothing from Val. The call site passes the module's value, so
 * the compiler still checks that the two agree.
 */
export type ThemeInput = {
  preset: PresetName;
  appearance: { mode: Mode | null; toggle: boolean | null };
  colors: {
    brand: string | null;
    accent: string | null;
    neutral: NeutralTone | null;
  };
  typography: {
    heading: FontInput | null;
    body: FontInput | null;
    scale: Scale | null;
    headingCase: TextCase | null;
    headingWeight: HeadingWeight | null;
    eyebrowCase: TextCase | null;
  };
  atoms: {
    button: {
      shape: ButtonShape | null;
      style: ButtonStyle | null;
      case: TextCase | null;
    };
    link: { underline: LinkUnderline | null };
  };
  base: {
    radius: Radius | null;
    density: Density | null;
    card: { style: CardStyle | null };
  };
};

type FontInput =
  | { type: "bundled"; font: BundledFont }
  | {
      type: "custom";
      fallback: FontFallback;
      files: readonly {
        file: { readonly url: string };
        weight: number;
        style: "normal" | "italic";
      }[];
    };

function font(input: FontInput | null, preset: FontChoice): FontChoice {
  if (input === null) {
    return preset;
  }
  if (input.type === "bundled") {
    return input;
  }
  if (input.files.length === 0) {
    // An empty list validates as an error, but the site still has to render
    // while an editor is halfway through adding one.
    return preset;
  }
  return {
    type: "custom",
    fallback: input.fallback,
    files: input.files.map(({ file, weight, style }) => ({
      url: file.url,
      weight,
      style,
    })),
  };
}

/**
 * The colour if it is a hex colour, otherwise `null`.
 *
 * The schema validates the format, but a draft renders before it validates —
 * and this string ends up inside a `<style>` element.
 */
function hex(value: string | null): string | null {
  return value !== null && parseHex(value) ? value : null;
}

/** Fills every empty choice from the preset. */
export function resolveTheme(input: ThemeInput): Theme {
  const preset = PRESETS[input.preset] ?? PRESETS.clean;
  const { colors, typography, atoms, base } = input;
  return {
    mode: input.appearance.mode ?? "system",
    toggle: input.appearance.toggle ?? true,
    colors: {
      brand: hex(colors.brand) ?? preset.colors.brand,
      accent: hex(colors.accent) ?? preset.colors.accent,
      neutral: colors.neutral ?? preset.colors.neutral,
    },
    typography: {
      heading: font(typography.heading, preset.typography.heading),
      body: font(typography.body, preset.typography.body),
      scale: typography.scale ?? preset.typography.scale,
      headingCase: typography.headingCase ?? preset.typography.headingCase,
      headingWeight:
        typography.headingWeight ?? preset.typography.headingWeight,
      eyebrowCase: typography.eyebrowCase ?? preset.typography.eyebrowCase,
    },
    atoms: {
      button: {
        shape: atoms.button.shape ?? preset.atoms.button.shape,
        style: atoms.button.style ?? preset.atoms.button.style,
        case: atoms.button.case ?? preset.atoms.button.case,
      },
      link: { underline: atoms.link.underline ?? preset.atoms.link.underline },
    },
    base: {
      radius: base.radius ?? preset.base.radius,
      density: base.density ?? preset.base.density,
      card: { style: base.card.style ?? preset.base.card.style },
    },
  };
}

/** A preset exactly as it ships — for Storybook and tests. */
export function presetTheme(name: PresetName, mode: Mode = "system"): Theme {
  return { ...PRESETS[name], mode, toggle: true };
}
