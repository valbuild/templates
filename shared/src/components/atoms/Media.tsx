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
 */
export function Media({
  media,
  aspect = "auto",
  rounded = true,
  className,
}: {
  media: MediaSchema;
  aspect?: MediaAspect;
  rounded?: boolean;
  className?: string;
}) {
  const classes = cn(
    "block w-full bg-subtle object-cover",
    aspect === "auto" ? "h-auto" : "h-full",
    rounded && "rounded-theme-lg",
  );
  return (
    <div
      className={cn(
        "overflow-hidden",
        ASPECT[aspect],
        rounded && "rounded-theme-lg",
        className,
      )}
    >
      {media.type === "image" ? (
        <ValImage src={media.image} className={classes} />
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
