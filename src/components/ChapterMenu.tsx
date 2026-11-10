"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useDismiss } from "@/lib/useDismiss";
import { BOOKS } from "@/lib/books";
import { arabicDigits } from "@/lib/arabic";
import { chapterHref, type View } from "@/lib/navigation";

/** Book and chapter picker. Closes on selection, outside click or Escape. */
export default function ChapterMenu({
  view,
  book,
  chapter,
  label,
  up = false,
}: {
  view: View;
  book: string;
  chapter: number;
  label: string;
  /** open the panel upwards (for use at the bottom of the page) */
  up?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ar = view === "arabic";

  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-md px-3 py-1 text-lg hover:text-accent"
      >
        {label} <span className="text-sm text-muted">▾</span>
      </button>
      {open && (
        <div className={`absolute left-1/2 z-40 ${up ? "bottom-full mb-2" : "mt-2"} max-h-[70vh] w-80 -translate-x-1/2 overflow-y-auto rounded-lg border border-line bg-surface p-3 shadow-lg`}>
          {BOOKS.map((b) => (
            <section key={b.slug} className="mb-3 last:mb-0">
              <h3 className={`mb-1.5 text-sm font-semibold ${b.slug === book ? "text-accent" : "text-muted"}`}>
                {ar ? b.arabic : b.english}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: b.chapters }, (_, i) => i + 1).map((c) => {
                  const current = b.slug === book && c === chapter;
                  return (
                    <Link
                      key={c}
                      href={chapterHref(view, b.slug, c)}
                      onClick={() => setOpen(false)}
                      aria-current={current ? "page" : undefined}
                      className={`rounded py-1 text-center hover:bg-panel hover:text-accent ${current ? "bg-panel text-accent" : ""}`}
                    >
                      {ar ? arabicDigits(c) : c}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
