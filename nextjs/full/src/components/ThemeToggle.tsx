"use client";

import { useEffect, useState } from "react";

/** "site" is the theme's own default: no override stored. */
type Choice = "site" | "light" | "dark";

function read(): Choice {
  try {
    const stored = window.localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : "site";
  } catch {
    return "site";
  }
}

function apply(choice: Choice) {
  const root = document.documentElement;
  if (choice === "site") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", choice);
  }
  try {
    if (choice === "site") {
      window.localStorage.removeItem("theme");
    } else {
      window.localStorage.setItem("theme", choice);
    }
  } catch {
    // Private mode: the choice holds for this page and is forgotten after.
  }
}

const NEXT: Record<Choice, Choice> = {
  site: "light",
  light: "dark",
  dark: "site",
};
const LABEL: Record<Choice, string> = {
  site: "Auto",
  light: "Light",
  dark: "Dark",
};

/**
 * A visitor's override of the site's light/dark default. Only `data-theme` on
 * <html> changes; `theme.css` turns that into `color-scheme`, and every colour
 * follows. The root layout applies the stored choice before the first paint.
 */
export default function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>("site");
  // Read once after hydration: the server cannot know a visitor's choice.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setChoice(read()), []);
  const next = NEXT[choice];
  return (
    <button
      type="button"
      onClick={() => {
        apply(next);
        setChoice(next);
      }}
      aria-label={`Colour mode: ${LABEL[choice]}. Switch to ${LABEL[next]}.`}
      className="rounded-theme border border-border px-3 py-1.5 font-body text-(length:--step-minus-1) font-semibold text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
    >
      {LABEL[choice]}
    </button>
  );
}
