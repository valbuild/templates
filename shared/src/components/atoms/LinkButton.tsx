import { buttonClassName, type ButtonSize, type ButtonVariant } from "./Button";
import { Link } from "./Link";

/** A link drawn as a button: "Read more", "Get started". */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-variant={variant}
      className={buttonClassName(size, className)}
    >
      {children}
    </Link>
  );
}
