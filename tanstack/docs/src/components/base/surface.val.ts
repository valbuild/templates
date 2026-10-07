import { s } from "../../../val.config";

/**
 * The background a section sits on. A role, not a colour: the theme decides
 * what each one looks like in light and in dark, and keeps text legible on
 * all of them.
 */
export const surfaceSchema = s
  .enum("default", "muted", "brand", "inverse")
  .describe(
    "Default and muted are quiet. Brand is the main colour; inverse is dark in light mode and light in dark mode. Use the loud ones sparingly.",
  );
