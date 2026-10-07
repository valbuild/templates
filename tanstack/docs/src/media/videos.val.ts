import { s, c } from "../../val.config";

/**
 * The site's videos. A field picks one with `s.video(videosVal)`.
 *
 * An entry holds what is true of the file (type, size, length) and, as
 * defaults for every use, what a page usually chooses about it: the
 * description, the poster, where it starts and ends. A field overrides any of
 * those key by key.
 */
export default c.define(
  "/src/media/videos.val.ts",
  s.videoset({
    dir: "/public/val/videos",
    accept: "video/*",
    alt: s
      .string()
      .nullable()
      .describe("What happens in the video, for people who cannot see it."),
  }),
  {
    "/public/val/videos/dusk.mp4": {
      mimeType: "video/mp4",
      width: 1280,
      height: 640,
      duration: 8,
      alt: "Hills drifting past a setting sun",
      poster: {
        path: "/public/val/videos/dusk-poster.webp",
        width: 1280,
        height: 640,
        mimeType: "image/webp",
      },
      posterTime: 0,
    },
  },
);
