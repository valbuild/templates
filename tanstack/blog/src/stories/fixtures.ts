import type { Image, ValEncodedString, Video } from "../framework";
import type { MediaSchema } from "../components/atoms/media.val";
import type { ProseSchema } from "../components/typography/prose.val";

/*
 * Sample content for stories.
 *
 * On the site, a string reaches a component through Val, carrying an invisible
 * edit tag — and its type, `ValEncodedString`, says so. A story has no Val
 * behind it, so `text()` is the one place a plain string is passed off as one.
 * The images live in `public/samples`, which Storybook serves too.
 */
export function text(value: string): ValEncodedString {
  return value as ValEncodedString;
}

export function sampleImage(
  file: string,
  width: number,
  height: number,
  alt: string,
  hotspot?: { x: number; y: number },
): Image {
  const url = `./samples/${file}`;
  return {
    path: `/public/val/${file}`,
    url: text(url),
    width,
    height,
    alt,
    mimeType: "image/svg+xml",
    ...(hotspot ? { hotspot } : {}),
  };
}

export const landscape = sampleImage(
  "landscape.svg",
  1600,
  1000,
  "Hills at sunset",
  { x: 0.7, y: 0.38 },
);
export const portrait = sampleImage("portrait.svg", 900, 1200, "A portrait", {
  x: 0.5,
  y: 0.4,
});
export const square = sampleImage("square.svg", 1000, 1000, "Shapes");

/** The sample video from the video library (`src/media/videos.val.ts`). */
export const dusk: Video = {
  path: "/public/val/videos/dusk.mp4",
  url: text("./val/videos/dusk.mp4"),
  mimeType: "video/mp4",
  width: 1280,
  height: 640,
  duration: 8,
  alt: "Hills drifting past a setting sun",
  poster: {
    path: "/public/val/videos/dusk-poster.webp",
    url: "./val/videos/dusk-poster.webp",
    width: 1280,
    height: 640,
    mimeType: "image/webp",
  },
};
export const duskMedia: MediaSchema = { type: "video", video: dusk };

export const landscapeMedia: MediaSchema = { type: "image", image: landscape };
export const portraitMedia: MediaSchema = { type: "image", image: portrait };
export const squareMedia: MediaSchema = { type: "image", image: square };

export const icons = {
  spark: { url: "./samples/icon-spark.svg" },
  leaf: { url: "./samples/icon-leaf.svg" },
  bolt: { url: "./samples/icon-bolt.svg" },
};

export const sampleProse: ProseSchema = [
  {
    tag: "p",
    children: [
      "Val is a CMS where ",
      { tag: "span", styles: ["bold"], children: ["content is code"] },
      ": it lives in your repository, next to the components that show it, and editors change it in the Studio without touching either.",
    ],
  },
  { tag: "h2", children: ["Why it works"] },
  {
    tag: "p",
    children: [
      "Everything an editor sees is typed by a schema, so a page cannot be saved in a shape the site does not understand. ",
      { tag: "a", href: "https://val.build/docs", children: ["Read the docs"] },
      " to see how.",
    ],
  },
  {
    tag: "ul",
    children: [
      {
        tag: "li",
        children: [
          { tag: "p", children: ["Local first, with Git as the history"] },
        ],
      },
      { tag: "li", children: [{ tag: "p", children: ["No signup to start"] }] },
      {
        tag: "li",
        children: [
          { tag: "p", children: ["Visual editing on the page itself"] },
        ],
      },
    ],
  },
];
