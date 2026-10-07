import type { HeroSectionSchema } from "./heroSection.val";
import { SectionHeader } from "../base/SectionHeader";
import { Container } from "../base/Container";
import { Cluster } from "../base/Cluster";
import { LinkButton } from "../atoms/LinkButton";
import { hrefOf } from "../atoms/hrefOf";
import { Media } from "../atoms/Media";

export function HeroSection({
  eyebrow,
  title,
  intro,
  buttons,
  background,
  surface,
}: HeroSectionSchema) {
  return (
    <section
      data-surface={background ? "default" : surface}
      /*
       * Over an image the text is light whatever the site's mode: the section
       * switches itself to dark, so every token inside — text, muted text,
       * buttons — takes its dark-mode value against the darkened image.
       */
      style={background ? { colorScheme: "dark" } : undefined}
      className="relative isolate flex min-h-[min(80vh,48rem)] items-center overflow-hidden py-[calc(var(--space-section)*1.5)]"
    >
      {background && (
        <>
          <Media media={background} fill rounded={false} className="-z-20" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_0_0/0.75),rgb(0_0_0/0.35))]"
          />
        </>
      )}
      <Container>
        <div className="flex flex-col items-center gap-8">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            intro={intro}
            level={1}
            size="display"
            align="center"
          />
          {buttons.length > 0 && (
            <Cluster justify="center">
              {buttons.map((button, index) => (
                <LinkButton
                  key={index}
                  href={hrefOf(button)}
                  variant={button.variant}
                  size="lg"
                >
                  {button.label}
                </LinkButton>
              ))}
            </Cluster>
          )}
        </div>
      </Container>
    </section>
  );
}
