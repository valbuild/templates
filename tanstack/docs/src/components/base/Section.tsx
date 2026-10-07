import { cn } from "../../utils/cn";
import type { Surface } from "../../theme/surfaces";
import { Container, type ContainerWidth } from "./Container";

export type { Surface };

/**
 * The band every section is drawn in: a surface, the theme's vertical rhythm,
 * and a container.
 *
 * The surface is what makes the section's contents legible without knowing
 * where they are: inside `brand`, text is the colour that reads on the brand
 * colour and a primary button inverts. See `theme/surfaces.ts`.
 */
export function Section({
  surface = "default",
  width = "default",
  className,
  children,
}: {
  surface?: Surface;
  width?: ContainerWidth;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section data-surface={surface} className={cn("py-section", className)}>
      <Container width={width}>{children}</Container>
    </section>
  );
}
