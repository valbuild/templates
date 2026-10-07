import { cn } from "../../utils/cn";
import { Text } from "../typography/Text";
import type { DocTextSchema } from "./doc.val";
import { DocText } from "./DocText";

type Tone = "note" | "tip" | "warning";

/*
 * Every tone on the same neutral background, told apart by the bar on the
 * left and by its label: text on a tinted background is a colour pair the
 * theme's contrast tests do not cover, so it is not used here.
 */
const TONES: Record<Tone, { label: string; className: string }> = {
  note: { label: "Note", className: "border-border" },
  tip: { label: "Tip", className: "border-link" },
  warning: { label: "Warning", className: "border-highlight" },
};

/**
 * A boxed aside. The tone is said in words as well as colour, so it reads the
 * same to someone who cannot tell the colours apart.
 */
export function Callout({
  tone,
  title,
  text,
}: {
  tone: Tone;
  title: string | null;
  text: DocTextSchema;
}) {
  const { label, className } = TONES[tone];
  return (
    <aside
      className={cn(
        "my-6 rounded-theme-lg border-l-4 bg-subtle px-5 py-4",
        className,
      )}
      aria-label={label}
    >
      <Text size="sm" className="mb-1 font-semibold">
        {title ?? label}
      </Text>
      <DocText value={text} />
    </aside>
  );
}
