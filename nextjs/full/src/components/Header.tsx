import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Container } from "./base/Container";

export default function Header({ toggle }: { toggle: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-lg">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
        <Link
          href="/"
          className="font-heading text-(length:--step-1) [font-weight:var(--heading-weight)] [letter-spacing:var(--heading-tracking)] [text-transform:var(--heading-case)] text-fg no-underline"
        >
          Your site
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 font-body text-(length:--step-minus-1) font-semibold">
          <Link href="/" className="text-fg-muted no-underline hover:text-fg">
            Home
          </Link>
          <Link
            href="/products/product-1"
            className="text-fg-muted no-underline hover:text-fg"
          >
            Example product
          </Link>
          {/*
            /val is Val Studio, under its own root layout, so Next loads it
            as a full page rather than swapping it into this one.
          */}
          <Link
            href="/val"
            className="text-fg-muted no-underline hover:text-fg"
          >
            Val Studio
          </Link>
        </nav>
        {toggle && (
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        )}
      </Container>
    </header>
  );
}
