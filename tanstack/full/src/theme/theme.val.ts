import { s, c, type t } from "../../val.config";

/*
 * The site's look, as content.
 *
 * Pick a preset, then override what you like. Every field below the preset is
 * nullable, and empty means "what the preset says" — so a fresh site looks
 * finished, and every override is a decision somebody made.
 *
 * Nothing here is a raw size or a free colour per component. Each choice is an
 * option that has been designed, and `resolveTheme` + `themeCss` turn the
 * choices into the CSS variables the components read. That is what lets a site
 * be its own without being able to look broken.
 */

const FOLLOWS_PRESET = "Empty: follows the preset.";

const caseSchema = s.enum("normal", "uppercase");

const fontSchema = s.discriminatedUnion(
  "type",
  s.object({
    type: s.literal("bundled"),
    font: s
      .enum(
        "inter",
        "plus-jakarta-sans",
        "archivo",
        "fraunces",
        "source-serif-4",
      )
      .describe("A font that ships with the site. No upload needed."),
  }),
  s.object({
    type: s.literal("custom"),
    fallback: s
      .enum("sans", "serif", "mono")
      .describe("Shown while the font loads, and if it fails to."),
    files: s
      .array(
        s.object({
          file: s
            .file()
            .validate((file) =>
              file.path.toLowerCase().endsWith(".woff2")
                ? false
                : "Upload a .woff2 file — the format every current browser reads, and the smallest.",
            ),
          weight: s
            .number({ min: 100, max: 900 })
            .validate((weight) =>
              Number.isInteger(weight) && weight % 100 === 0
                ? false
                : "A weight is a whole hundred: 400 is regular, 700 is bold.",
            ),
          style: s.enum("normal", "italic"),
        }),
      )
      .validate((files) =>
        files.length > 0 ? false : "Add at least one font file.",
      )
      .describe(
        "One file per weight and style. A variable font is one file: give it the weight it should be used at.",
      ),
  }),
);

export const themeSchema = s.object({
  preset: s
    .enum("clean", "editorial", "bold", "soft")
    .describe(
      "Where the look starts. Clean: product and docs. Editorial: type-first, airy. Bold: loud and tight. Soft: round and warm.",
    ),
  appearance: s.object({
    mode: s
      .enum("system", "light", "dark")
      .nullable()
      .describe(
        "What a visitor sees before they choose. Empty: follows their device.",
      ),
    toggle: s
      .boolean()
      .nullable()
      .describe(
        "Whether the header offers a light/dark switch. Empty: it does.",
      ),
  }),
  colors: s.object({
    brand: s
      .color({ format: "hex" })
      .nullable()
      .describe(
        `The main colour: buttons, brand sections, links. Every shade the site needs is made from it, in light and dark. ${FOLLOWS_PRESET}`,
      ),
    accent: s
      .color({ format: "hex" })
      .nullable()
      .describe(
        `A second colour, for small highlights: eyebrows and tags. ${FOLLOWS_PRESET}`,
      ),
    neutral: s
      .enum("cool", "neutral", "warm")
      .nullable()
      .describe(`The tint of the greys. ${FOLLOWS_PRESET}`),
  }),
  typography: s.object({
    heading: fontSchema.nullable().describe(`Headings. ${FOLLOWS_PRESET}`),
    body: fontSchema.nullable().describe(`Everything else. ${FOLLOWS_PRESET}`),
    scale: s
      .enum("compact", "default", "dramatic")
      .nullable()
      .describe(
        `How much bigger each heading level is than the one below. ${FOLLOWS_PRESET}`,
      ),
    headingCase: caseSchema.nullable().describe(FOLLOWS_PRESET),
    headingWeight: s
      .enum("regular", "semibold", "black")
      .nullable()
      .describe(FOLLOWS_PRESET),
    eyebrowCase: caseSchema
      .nullable()
      .describe(`The small line above a heading. ${FOLLOWS_PRESET}`),
  }),
  atoms: s.object({
    button: s.object({
      shape: s
        .enum("square", "rounded", "pill")
        .nullable()
        .describe(FOLLOWS_PRESET),
      style: s
        .enum("solid", "outline", "soft")
        .nullable()
        .describe(
          `How the main button is drawn. The secondary button is always quieter. ${FOLLOWS_PRESET}`,
        ),
      case: caseSchema.nullable().describe(FOLLOWS_PRESET),
    }),
    link: s.object({
      underline: s
        .enum("always", "hover", "never")
        .nullable()
        .describe(`Links in running text. ${FOLLOWS_PRESET}`),
    }),
  }),
  base: s.object({
    radius: s
      .enum("square", "tight", "default", "soft")
      .nullable()
      .describe(`How round cards, images and fields are. ${FOLLOWS_PRESET}`),
    density: s
      .enum("compact", "default", "airy")
      .nullable()
      .describe(`Space between and inside sections. ${FOLLOWS_PRESET}`),
    card: s.object({
      style: s
        .enum("flat", "outlined", "raised")
        .nullable()
        .describe(FOLLOWS_PRESET),
    }),
  }),
});

export type ThemeContent = t.inferSchema<typeof themeSchema>;

export default c.define("/src/theme/theme.val.ts", themeSchema, {
  preset: "clean",
  appearance: { mode: null, toggle: null },
  colors: { brand: null, accent: null, neutral: null },
  typography: {
    heading: null,
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
