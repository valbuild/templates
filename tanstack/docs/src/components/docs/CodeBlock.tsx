import { useEffect, useState } from "react";
import { val } from "../../../val.config";
import { Caption } from "../typography/Caption";

/**
 * Code, as it should be copied: in a monospace block that scrolls sideways
 * rather than wrapping, with a button that copies it.
 *
 * The code is shown with `val.raw`, because a string read through Val carries
 * an invisible edit tag — harmless in prose, but it would come along when a
 * reader selects and copies the code, and break whatever they paste it into.
 * `val.attrs` puts the tag back on the element instead, so the block is still
 * click-to-edit in the Studio.
 */
export function CodeBlock({
  filename,
  code,
}: {
  filename: string | null;
  code: string;
}) {
  const raw = val.raw(code);
  return (
    <figure className="my-6 overflow-hidden rounded-theme-lg border border-border bg-subtle">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2">
        <Caption className="font-mono">{filename ?? ""}</Caption>
        <CopyButton text={raw} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono" {...val.attrs({ code })}>
          {raw}
        </code>
      </pre>
    </figure>
  );
}

/**
 * Shown only where the browser lets a page write to the clipboard: not in an
 * insecure context, and not before the page has hydrated, where a button
 * would do nothing at all.
 */
function CopyButton({ text }: { text: string }) {
  const [available, setAvailable] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setAvailable(typeof navigator !== "undefined" && !!navigator.clipboard);
  }, []);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  if (!available) {
    return null;
  }
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard.writeText(text).then(
          () => setCopied(true),
          () => setAvailable(false),
        )
      }
      className="font-body text-(length:--step-minus-1) font-semibold text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-link"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
