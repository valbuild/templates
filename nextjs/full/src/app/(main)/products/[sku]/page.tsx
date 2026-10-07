import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { val } from "../../../../../val.config";
import { AnySection } from "@/components/sections/AnySection";
import { fetchValRoute } from "@/val/val.rsc";
import pageVal from "./page.val";

type Props = { params: Promise<{ sku: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await fetchValRoute(pageVal, params);
  if (!page) {
    return {};
  }
  // `val.raw`: metadata is read by browsers and crawlers, not rendered, so the
  // invisible edit tags must not be in it.
  return {
    title: val.raw(page.meta.title),
    description: val.raw(page.meta.description),
  };
}

export default async function ProductPage({ params }: Props) {
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
