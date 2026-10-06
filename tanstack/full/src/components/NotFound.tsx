import { Eyebrow } from "./typography/Eyebrow";
import { Heading } from "./typography/Heading";
import { Text } from "./typography/Text";
import { LinkButton } from "./atoms/LinkButton";
import { Section } from "./base/Section";
import { Stack } from "./base/Stack";

/**
 * The site's 404.
 *
 * With Val this is a page an editor can reach by accident — a route whose
 * content entry has not been created yet, or one they have just deleted — so it
 * should look like part of the site rather than like a crash.
 */
export function NotFound() {
  return (
    <main>
      <Section width="narrow">
        <Stack gap="md" align="start">
          <Eyebrow>404</Eyebrow>
          <Heading level={1}>This page has no content yet</Heading>
          <Text tone="muted">
            If you are editing in Val Studio, add an entry for this route under{" "}
            <strong>Pages</strong>.
          </Text>
          <LinkButton href="/">Back to the home page</LinkButton>
        </Stack>
      </Section>
    </main>
  );
}
