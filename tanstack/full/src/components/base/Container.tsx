import { cn } from "../../utils/cn";

export type ContainerWidth = "narrow" | "default" | "wide";

const WIDTH: Record<ContainerWidth, string> = {
  narrow: "max-w-[42rem]",
  default: "max-w-[72rem]",
  wide: "max-w-[88rem]",
};

/** Centres content and keeps it off the screen's edges. */
export function Container({
  width = "default",
  className,
  children,
}: {
  width?: ContainerWidth;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8", WIDTH[width], className)}>
      {children}
    </div>
  );
}
