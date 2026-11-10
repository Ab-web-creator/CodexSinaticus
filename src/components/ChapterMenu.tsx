import Link from "next/link";

/** Dropdown grid of chapter links, built on <details> so it needs no client JS. */
export default function ChapterMenu({
  label,
  current,
  count,
  href,
  format = String,
}: {
  label: React.ReactNode;
  current: number;
  count: number;
  href: (c: number) => string;
  format?: (c: number) => string;
}) {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-md px-3 py-1 text-lg hover:text-accent">
        {label} <span className="text-sm text-muted">▾</span>
      </summary>
      <div className="absolute left-1/2 z-40 mt-2 grid w-72 -translate-x-1/2 grid-cols-6 gap-1.5 rounded-lg border border-line bg-surface p-3 shadow-lg">
        {Array.from({ length: count }, (_, i) => i + 1).map((c) => (
          <Link
            key={c}
            href={href(c)}
            className={`rounded py-1 text-center text-lg hover:bg-panel hover:text-accent ${c === current ? "bg-panel text-accent" : ""}`}
          >
            {format(c)}
          </Link>
        ))}
      </div>
    </details>
  );
}
