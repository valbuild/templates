import { createFileRoute } from "@tanstack/react-router";
import homeVal from "../content/home.val";
import { useVal } from "../val/val.hooks";

/*
 * The example page: everything that is not needed to run Val.
 *
 * To start from nothing, delete this file and `src/content/home.val.ts`, and
 * remove the module from `val.modules.ts`.
 */
export const Route = createFileRoute("/_site/")({
  head: () => ({ meta: [{ title: "Hello, Val" }] }),
  component: Home,
});

function Home() {
  // Read in the component: published content on the server, and whatever the
  // editor holds while Val Studio is open — so every string is editable.
  const home = useVal(homeVal);
  return (
    <main style={styles.main}>
      <h1 style={styles.title}>{home.title}</h1>
      {home.text.split("\n\n").map((paragraph, index) => (
        <p key={index} style={styles.text}>
          {paragraph}
        </p>
      ))}
      <p style={styles.text}>
        {/* A plain anchor: /val is Val Studio, a separate app. */}
        <a href="/val" style={styles.link}>
          Open Val Studio →
        </a>
      </p>
    </main>
  );
}

/*
 * Inline, so the page's look leaves with the page: no stylesheet, no CSS
 * framework, nothing to clean up. Bring whatever styling you like.
 */
const styles = {
  main: {
    boxSizing: "border-box",
    maxWidth: "36rem",
    minHeight: "100vh",
    margin: "0 auto",
    padding: "6rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1.5rem",
  },
  title: {
    margin: 0,
    fontSize: "2.25rem",
    lineHeight: 1.1,
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  text: { margin: 0, fontSize: "1.125rem", lineHeight: 1.6 },
  link: { color: "inherit", textUnderlineOffset: "4px" },
} satisfies Record<string, React.CSSProperties>;
