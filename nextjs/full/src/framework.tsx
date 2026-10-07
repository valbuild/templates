import Link from "next/link";

/*
 * Everything the components need from the framework, in one place.
 *
 * The components under `src/components` and `src/theme` are the same files in
 * every Val template, whatever it is built on; this file is what differs. A
 * component that needs the router or a Val renderer imports it from here,
 * never from `next/*` or `@valbuild/next` directly.
 */

export {
  ValImage,
  ValRichText,
  ValVideo,
  type Image,
  type Video,
  type ValEncodedString,
} from "@valbuild/next";

/**
 * A client-side navigation to a path in this site. Takes a plain string: a
 * link from content is not known at compile time.
 */
export function RouterLink({
  href,
  ...props
}: { href: string } & Omit<React.ComponentProps<"a">, "href">) {
  return <Link href={href} {...props} />;
}
