import { cn } from "../../utils/cn";
import { GAP, type Space } from "./Stack";

/**
 * Things side by side that wrap onto the next line when they run out of room:
 * a row of buttons, tags, logos.
 */
export function Cluster({
  gap = "sm",
  justify = "start",
  className,
  children,
}: {
  gap?: Space;
  justify?: "start" | "center" | "end" | "between";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center",
        GAP[gap],
        {
          start: "justify-start",
          center: "justify-center",
          end: "justify-end",
          between: "justify-between",
        }[justify],
        className,
      )}
    >
      {children}
    </div>
  );
}
