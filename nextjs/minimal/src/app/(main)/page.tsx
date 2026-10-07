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
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{home.title}</h1>
      {home.text.split("\n\n").map((paragraph, index) => (
        <p key={index} className="text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
      <p>
        {/*
         * /val is Val Studio, under its own root layout, so Next loads it as a
         * full page rather than swapping it into this one.
         */}
        <Link href="/val" className="underline underline-offset-4">
          Open Val Studio →
        </Link>
      </p>
    </main>
  );
}
