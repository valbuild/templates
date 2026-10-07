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
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{home.title}</h1>
      {home.text.split("\n\n").map((paragraph, index) => (
        <p key={index} className="text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
      <p>
        {/* A plain anchor: /val is Val Studio, a separate app. */}
        <a href="/val" className="underline underline-offset-4">
          Open Val Studio →
        </a>
      </p>
    </main>
  );
}
