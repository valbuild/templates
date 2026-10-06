import type { CardGridSectionSchema } from "./cardGridSection.val";
import { Section } from "../base/Section";
import { SectionHeader } from "../base/SectionHeader";
import { Stack } from "../base/Stack";
import { Grid, type GridColumns } from "../base/Grid";
import { Card, CardBody } from "../base/Card";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";
import { TextLink } from "../typography/TextLink";
import { Media } from "../atoms/Media";
import { Tag } from "../atoms/Tag";
import { hrefOf } from "../atoms/hrefOf";

const COLUMNS: Record<CardGridSectionSchema["columns"], GridColumns> = {
  "2": 2,
  "3": 3,
  "4": 4,
};

export function CardGridSection({
  eyebrow,
  title,
  intro,
  columns,
  cards,
  surface,
}: CardGridSectionSchema) {
  return (
    <Section surface={surface}>
      <Stack gap="lg">
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
        <Grid columns={COLUMNS[columns]}>
          {cards.map((card, index) => (
            <Card key={index}>
              {card.image && (
                <Media
                  media={{ type: "image", image: card.image }}
                  aspect="landscape"
                  rounded={false}
                />
              )}
              <CardBody>
                {card.tag && <Tag className="self-start">{card.tag}</Tag>}
                <Heading level={3} size="xs">
                  {card.title}
                </Heading>
                {card.text && (
                  <Text size="sm" tone="muted">
                    {card.text}
                  </Text>
                )}
                {card.link && (
                  <TextLink href={hrefOf(card.link)} className="mt-auto pt-2">
                    {card.link.label} →
                  </TextLink>
                )}
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}
