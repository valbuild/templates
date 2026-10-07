export const metadata = {
  title: "Val Studio",
};

/**
 * The root layout of Val Studio (`/val`) and the Val API — its own, so that
 * nothing of the site's reaches the Studio: not the site's stylesheet, not
 * its fonts, not its colour scheme (which would change the Studio's
 * scrollbars and form controls).
 *
 * The background is the Studio's from the very first frame. The Studio
 * paints a dark loading screen while it starts; this keeps the document
 * around it the same colour, so there is no white edge or flash. The colour
 * matches `defaultTheme: "dark"` in `val.config.ts` — change both together.
 */
export default function ValLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: "#08080a", colorScheme: "dark" }}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
