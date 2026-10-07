import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { val } from "../../../val.config";
import { AnySection } from "@/components/sections/AnySection";
import { fetchValRoute } from "@/val/val.rsc";
import pageVal from "./page.val";

type Props = { params: Promise<Record<string, never>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await fetchValRoute(pageVal, params);
  if (!page) {
    return {};
  }
  // `val.raw`: metadata is read by browsers and crawlers, not rendered.
  return {
    title: { absolute: val.raw(page.meta.title) },
    description: val.raw(page.meta.description),
  };
}

export default async function Home({ params }: Props) {
  // The route's params go in as they are: `fetchValRoute` turns them into the
  // record key by way of this module's file path.
  const page = await fetchValRoute(pageVal, params);
  if (!page) {
    notFound();
  }
  return (
    <main>
      {page.sections.map((section, index) => (
        <AnySection key={`${section.type}-${index}`} section={section} />
      ))}
    </main>
  );
}
