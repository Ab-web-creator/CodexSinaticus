"use client";

import { TOGGLE } from "@/lib/styles";
import { useHtmlFlag } from "@/lib/useHtmlFlag";

/** Turns the word-by-word English glosses under the Greek on (default) or off; "off" is remembered. */
export default function InterlinearToggle() {
  const [plain, setPlain] = useHtmlFlag("plain");
  const on = !plain;
  return (
    <button
      type="button"
      onClick={() => setPlain(on)}
      aria-pressed={on}
      title="Show an English gloss under each Greek word"
      className={`px-2.5 py-1 text-sm ${on ? "rounded-md border border-accent bg-panel text-accent" : TOGGLE}`}
    >
      Interlinear
    </button>
  );
}
