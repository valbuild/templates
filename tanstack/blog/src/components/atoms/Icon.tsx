import { val } from "../../../val.config";
import { cn } from "../../utils/cn";

export type IconSize = "sm" | "md" | "lg" | "xl";

const SIZE: Record<IconSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
  xl: "size-12",
};

/**
 * A single-colour icon in `currentColor`.
 *
 * The SVG is a CSS mask over a block of the text colour rather than an
 * `<img>`, which is what lets an uploaded file follow the theme. Decorative
 * unless it has a label.
 */
export function Icon({
  icon,
  label,
  size = "md",
  className,
}: {
  icon: { readonly url: string; readonly alt?: string };
  label?: string;
  size?: IconSize;
  className?: string;
}) {
  const url = `url(${JSON.stringify(val.raw(icon.url))})`;
  const name = label ?? (icon.alt ? val.raw(icon.alt) : undefined);
  return (
    <span
      {...val.attrs(icon)}
      role={name ? "img" : undefined}
      aria-label={name}
      aria-hidden={name ? undefined : true}
      className={cn("inline-block shrink-0 bg-current", SIZE[size], className)}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
