import { cn } from "../../utils/cn";
import { GAP, type Space } from "./Stack";

export type GridColumns = 1 | 2 | 3 | 4;

const COLUMNS: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Equal columns that collapse on smaller screens: one column on a phone, two
 * on a tablet, `columns` from a laptop up.
 */
export function Grid({
  columns = 3,
  gap = "md",
  className,
  children,
}: {
  columns?: GridColumns;
  gap?: Space;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid", COLUMNS[columns], GAP[gap], className)}>
      {children}
    </div>
  );
}
