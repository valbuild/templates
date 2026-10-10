# Media libraries

Every image, video and file on the site comes from one of these libraries, and
a field picks from them: `s.image(imagesVal)`, `s.video(videosVal)`,
`s.file(filesVal)`, `s.font(fontsVal)`.

| Module          | Holds                                                   | Folder               |
| --------------- | ------------------------------------------------------- | -------------------- |
| `images.val.ts` | photos and illustrations                                | `/public/val/images` |
| `videos.val.ts` | videos, with posters and captions                       | `/public/val/videos` |
| `files.val.ts`  | downloads: PDFs and other documents                     | `/public/val/files`  |
| `icons.val.ts`  | single-colour SVG icons                                 | `/public/val/icons`  |
| `fonts.val.ts`  | custom fonts for the theme (`.woff2`), an `s.fontset()` | `/public/val/fonts`  |

Why libraries rather than an upload per field:

- **One file, many places.** The same image on three pages is one file with one
  entry. Its size, type and default alt text are written once, in the library.
- **Defaults that a page can override.** An image's alt text and focal point,
  a video's poster, start and end, are set on the library entry; a page that
  wants something else sets just that key.
- **Editors find things.** The Studio lists every library under Media, so
  "the photo we used on the home page" is something you can browse to.

These modules are this site's CONTENT, so they are not shared between
templates: the components import them by path, and each template has its own.
