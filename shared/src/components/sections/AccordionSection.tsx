import { useId } from "react";
import type { AccordionSectionSchema } from "./accordionSection.val";
import { Section } from "../base/Section";
import { SectionHeader } from "../base/SectionHeader";
import { Accordion, AccordionItem } from "../base/Accordion";
import { Prose } from "../typography/Prose";

export function AccordionSection({
  eyebrow,
  title,
  intro,
  items,
  oneAtATime,
  surface,
}: AccordionSectionSchema) {
  const group = useId();
  return (
    <Section surface={surface}>
      <div className="grid gap-[calc(var(--space-gap)*2)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
        <Accordion>
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              summary={item.question}
              group={oneAtATime ? group : undefined}
            >
              <Prose value={item.answer} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
