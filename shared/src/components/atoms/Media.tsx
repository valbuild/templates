import { ValImage, ValVideo } from "../../framework";
import { cn } from "../../utils/cn";
import type { MediaSchema } from "./media.val";

export type MediaAspect = "auto" | "square" | "landscape" | "wide" | "portrait";

const ASPECT: Record<MediaAspect, string> = {
  auto: "",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-video",
  portrait: "aspect-[3/4]",
};

/**
 * An image or a video, cropped to an aspect ratio.
 *
 * The crop keeps the editor's focal point (the hotspot they set in the Studio)
 * in frame — `ValImage` and `ValVideo` turn it into `object-position` — so a
 * portrait can sit in a wide slot without losing the face. Corners follow the
 * theme's radius.
 *
 * Videos play muted and looping, as a moving picture; a video meant to be
 * WATCHED, with controls and sound, is a different component.
 *
 * Images load lazily unless `priority` is set. React preloads every `<img>`
 * without `loading="lazy"` from the page's `<head>`, so a page of cards and a
 * carousel competed with what is actually in view for the first second of the
 * network. A lazy image that IS in view is worse still -- the browser waits for
 * layout before fetching it -- so the page's first section passes `priority`
 * down (`AnySection`), and a hero always does.
 */
export function Media({
  media,
  aspect = "auto",
  rounded = true,
  fill = false,
  priority = false,
  className,
}: {
  media: MediaSchema;
  aspect?: MediaAspect;
  rounded?: boolean;
  /** Cover the nearest positioned parent, as a background. Ignores `aspect`. */
  fill?: boolean;
  /** In view when the page opens: load it first rather than lazily. */
  priority?: boolean;
  className?: string;
}) {
  const classes = cn(
    "block w-full bg-subtle object-cover",
    aspect === "auto" && !fill ? "h-auto" : "h-full",
    rounded && "rounded-theme-lg",
  );
  return (
    <div
      className={cn(
        "overflow-hidden",
        fill ? "absolute inset-0" : ASPECT[aspect],
        rounded && "rounded-theme-lg",
        className,
      )}
    >
      {media.type === "image" ? (
        <ValImage
          src={media.image}
          className={classes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
        />
      ) : (
        <ValVideo
          src={media.video}
          className={classes}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </div>
  );
}
