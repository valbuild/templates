import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

/**
 * A row of slides that scrolls sideways, one slide at a time.
 *
 * The scrolling is the browser's (CSS scroll snap), so it works by swipe,
 * trackpad and keyboard with no script at all; the buttons are the only part
 * that needs JavaScript, and they appear once it has run. The next slide
 * peeks in from the edge, which is what tells people there is more.
 */
export function Carousel({
  label,
  className,
  children,
}: {
  /** What the slides are, for screen readers: "Gallery". */
  label: string;
  className?: string;
  children: React.ReactNode[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<{ start: boolean; end: boolean } | null>(
    null,
  );

  useEffect(() => {
    const element = track.current;
    if (!element) {
      return;
    }
    const update = () =>
      setEdges({
        start: element.scrollLeft <= 1,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
      });
    update();
    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      element.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (direction: 1 | -1) => {
    const element = track.current;
    const slide = element?.firstElementChild;
    if (!element || !(slide instanceof HTMLElement)) {
      return;
    }
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollBy({
      left: direction * (slide.offsetWidth + gap),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("flex flex-col gap-4", className)}
    >
      <div
        ref={track}
        tabIndex={0}
        className="-mx-5 flex snap-x snap-mandatory gap-gap overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-link sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, index) => (
          <div
            key={index}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${children.length}`}
            className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[46%]"
          >
            {child}
          </div>
        ))}
      </div>
      {edges && (
        <div className="flex justify-end gap-2">
          <CarouselButton
            label="Previous"
            disabled={edges.start}
            onClick={() => step(-1)}
          >
            ←
          </CarouselButton>
          <CarouselButton
            label="Next"
            disabled={edges.end}
            onClick={() => step(1)}
          >
            →
          </CarouselButton>
        </div>
      )}
    </section>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="button inline-flex size-11 items-center justify-center font-body text-(length:--step-1) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link disabled:opacity-35"
      data-variant="secondary"
    >
      {children}
    </button>
  );
}
