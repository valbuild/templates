import { s } from "../../../val.config";

/**
 * The three lines most sections open with. Spread into a section's object, so
 * the fields sit at the top of the section in the Studio, in this order.
 */
export const sectionHeaderFields = {
  eyebrow: s
    .string()
    .maxLength(40)
    .nullable()
    .describe("A few words above the title: a category, a theme, “New”."),
  title: s.string().maxLength(120),
  intro: s
    .string()
    .multiline()
    .maxLength(400)
    .nullable()
    .describe("One or two sentences under the title."),
};
