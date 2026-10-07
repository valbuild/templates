import { cn } from "../../utils/cn";

/** A hairline between two things, in the surface's border colour. */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border", className)} />;
}
