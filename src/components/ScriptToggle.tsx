"use client";

import { useEffect, useState } from "react";

/** Switches the Greek column between lowercase transcription and majuscule (uncial-style) display. */
export default function ScriptToggle() {
  const [uncial, setUncial] = useState(false);

  useEffect(() => {
    setUncial(document.documentElement.dataset.uncial === "true");
  }, []);

  const toggle = () => {
    const next = !uncial;
    setUncial(next);
    document.documentElement.dataset.uncial = String(next);
    try {
      localStorage.setItem("uncial", String(next));
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={uncial}
      className="greek rounded-md border border-line px-3 py-1.5 text-sm hover:border-accent"
      title="Toggle majuscule display of the Greek"
    >
      {uncial ? "ΑΒΓ" : "αβγ"}
    </button>
  );
}
