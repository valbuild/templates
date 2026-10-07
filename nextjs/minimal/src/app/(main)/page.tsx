import Link from "next/link";
import homeVal from "@/content/home.val";
import { fetchVal } from "@/val/val.rsc";

/*
 * The example page: everything that is not needed to run Val.
 *
 * To start from nothing, delete this file and `src/content/home.val.ts`, and
 * remove the module from `val.modules.ts`.
 */
export default async function Home() {
  // A Server Component reads with `fetchVal`: published content for visitors,
  // the editor's draft in draft mode — and every string stays editable.
  const home = await fetchVal(homeVal);
  return (
    <main style={styles.main}>
      <h1 style={styles.title}>{home.title}</h1>
      {home.text.split("\n\n").map((paragraph, index) => (
        <p key={index} style={styles.text}>
          {paragraph}
        </p>
      ))}
      <p style={styles.text}>
        {/*
         * /val is Val Studio, under its own root layout, so Next loads it as a
         * full page rather than swapping it into this one.
         */}
        <Link href="/val" style={styles.link}>
          Open Val Studio →
        </Link>
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
