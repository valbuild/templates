import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";
import { Container } from "./base/Container";

export default function Header({ toggle }: { toggle: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-lg">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
        <Link
          to="/"
          className="font-heading text-(length:--step-1) [font-weight:var(--heading-weight)] [letter-spacing:var(--heading-tracking)] [text-transform:var(--heading-case)] text-fg no-underline"
        >
          Your site
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 font-body text-(length:--step-minus-1) font-semibold">
          <Link
            to="/"
            className="text-fg-muted no-underline hover:text-fg"
            activeProps={{ className: "text-fg" }}
          >
            Home
          </Link>
          <Link
            to="/products/$sku"
            params={{ sku: "product-1" }}
            className="text-fg-muted no-underline hover:text-fg"
            activeProps={{ className: "text-fg" }}
          >
            Example product
          </Link>
          {/*
            A plain anchor, not a router Link: /val is Val Studio, a separate
            app that must be loaded with a full page navigation rather than
            swapped into this one.
          */}
          <a href="/val" className="text-fg-muted no-underline hover:text-fg">
            Val Studio
          </a>
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
