import { Container } from "./base/Container";
import { Text } from "./typography/Text";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-surface="muted"
      className="mt-auto border-t border-border py-10"
    >
      <Container className="flex flex-col justify-between gap-2 sm:flex-row">
        <Text size="sm" tone="muted">
          &copy; {year} Your name here. All rights reserved.
        </Text>
        <Text size="sm" tone="muted">
          Built with Val + TanStack Start
        </Text>
      </Container>
    </footer>
  );
}
