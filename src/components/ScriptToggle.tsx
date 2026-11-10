"use client";

import { useHtmlFlag } from "@/lib/useHtmlFlag";

/** Two-part switch: Greek in lowercase (αβγ) or in majuscule/uncial capitals (ΑΒΓ) as in the codex. */
export default function ScriptToggle() {
  const [uncial, setUncial] = useHtmlFlag("uncial");

  const option = (value: boolean, text: string, title: string) => (
    <button
      type="button"
      onClick={() => setUncial(value)}
      aria-pressed={uncial === value}
      title={title}
      className={`px-2.5 py-1 ${uncial === value ? "bg-panel text-accent" : "text-muted hover:text-foreground"}`}
    >
      {text}
    </button>
  );

  return (
    <div role="group" aria-label="Greek letter style" className="greek flex overflow-hidden rounded-md border border-line text-sm">
      {option(false, "αβγ", "Greek in lowercase")}
      {option(true, "ΑΒΓ", "Greek in capitals, as written in the codex")}
    </div>
  );
}
