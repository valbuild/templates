import { s, c } from "../../val.config";

/**
 * The site's images. A field picks one with `s.image(imagesVal)`, and gets the
 * width, height, type and default alt text from the entry here.
 *
 * The alt text set here is the default for every use of the image; a field can
 * write its own.
 */
export default c.define(
  "/src/media/images.val.ts",
  s.imageset({
    dir: "/public/val/images",
    accept: "image/*",
    alt: s
      .string()
      .nullable()
      .describe("What the image shows, for people who cannot see it."),
  }),
  {
    "/public/val/images/avatar-ada.svg": {
      width: 256,
      height: 256,
      mimeType: "image/svg+xml",
      alt: "Portrait of Ada",
    },
    "/public/val/images/avatar-linus.svg": {
      width: 256,
      height: 256,
      mimeType: "image/svg+xml",
      alt: "Portrait of Linus",
    },
    "/public/val/images/hero-dusk.svg": {
      width: 2400,
      height: 1200,
      mimeType: "image/svg+xml",
      alt: "Hills under a dusk sky",
    },
    "/public/val/images/card-local.svg": {
      width: 1200,
      height: 900,
      mimeType: "image/svg+xml",
      alt: "Abstract shapes in blue",
    },
    "/public/val/images/card-visual.svg": {
      width: 1200,
      height: 900,
      mimeType: "image/svg+xml",
      alt: "Abstract shapes in orange",
    },
    "/public/val/images/card-theme.svg": {
      width: 1200,
      height: 900,
      mimeType: "image/svg+xml",
      alt: "Abstract shapes in green",
    },
    "/public/val/images/coast.svg": {
      width: 1600,
      height: 1000,
      mimeType: "image/svg+xml",
      alt: "A coastline in the morning",
    },
    "/public/val/images/forest.svg": {
      width: 1600,
      height: 1000,
      mimeType: "image/svg+xml",
      alt: "Green hills and a pale sun",
    },
    "/public/val/images/desert.svg": {
      width: 1600,
      height: 1000,
      mimeType: "image/svg+xml",
      alt: "Desert dunes in the afternoon",
    },
    "/public/val/images/night.svg": {
      width: 1600,
      height: 1000,
      mimeType: "image/svg+xml",
      alt: "Mountains under a starry sky",
      // The default focal point of every use of this image.
      hotspot: { x: 0.78, y: 0.3 },
    },
  },
);
