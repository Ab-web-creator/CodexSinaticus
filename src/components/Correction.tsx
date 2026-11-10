"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useDismiss } from "@/lib/useDismiss";
import { HANDS } from "@/lib/books";
import type { CorrectionReading, GreekToken } from "@/lib/types";
import GreekTokens from "./GreekTokens";

/**
 * Shows the first-hand reading, marked as corrected. Clicking it reveals what
 * later hands changed it to.
 */
export default function Correction({
  orig,
  corr,
}: {
  orig: GreekToken[];
  corr: CorrectionReading[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const added = orig.length === 0;

  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="correction cursor-pointer"
        title={added ? "Text added by a corrector" : "Corrected by a later hand"}
      >
        {added ? <span className="text-accent">⸆</span> : <GreekTokens tokens={orig} />}
      </button>
      {open && (
        <span
          id={id}
          role="dialog"
          className="absolute left-0 top-full z-20 mt-1 block w-max max-w-[min(22rem,80vw)] rounded-md border border-line bg-surface p-3 text-sm leading-relaxed shadow-lg"
        >
          <span className="block font-sans text-xs uppercase tracking-wide text-muted">
            {HANDS.firsthand}
          </span>
          <span className="block">
            {added ? <em className="font-sans text-muted">nothing (omitted)</em> : <GreekTokens tokens={orig} />}
          </span>
          {corr.map((r, i) => (
            <span key={i} className="mt-2 block">
              <span className="block font-sans text-xs uppercase tracking-wide text-muted">
                {HANDS[r.h] ?? r.h}
              </span>
              <span className="block">
                {r.t.length ? <GreekTokens tokens={r.t} /> : <em className="font-sans text-muted">deleted</em>}
              </span>
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
