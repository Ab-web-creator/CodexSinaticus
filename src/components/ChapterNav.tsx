import Link from "next/link";
import type { BookInfo } from "@/lib/books";
import { adjacentChapters, chapterHref, chapterLabel, type ChapterRef, type View } from "@/lib/navigation";
import ChapterMenu from "./ChapterMenu";

/** Header control: previous arrow, book/chapter menu, next arrow. Mirrors itself inside RTL pages. */
export default function ChapterNav({
  view,
  book,
  chapter,
}: {
  view: View;
  book: BookInfo;
  chapter: number;
}) {
  const { prev, next } = adjacentChapters(book.slug, chapter);
  const ar = view === "arabic";
  return (
    <nav className="flex items-center gap-1" aria-label={ar ? "التنقل بين الأصحاحات" : "Chapter navigation"}>
      {/* Same characters in both directions: browsers mirror ‹ › automatically inside RTL text. */}
      <Arrow view={view} to={prev} symbol="‹" label={ar ? "السابق" : "Previous chapter"} />
      <ChapterMenu view={view} book={book.slug} chapter={chapter} label={chapterLabel(view, book, chapter)} />
      <Arrow view={view} to={next} symbol="›" label={ar ? "التالي" : "Next chapter"} />
    </nav>
  );
}

function Arrow({ view, to, symbol, label }: { view: View; to?: ChapterRef; symbol: string; label: string }) {
  if (!to) return <span className="w-8 text-center text-2xl text-line" aria-hidden>{symbol}</span>;
  return (
    <Link
      href={chapterHref(view, to.book.slug, to.chapter)}
      aria-label={label}
      title={label}
      className="w-8 rounded text-center text-2xl leading-none hover:text-accent"
    >
      {symbol}
    </Link>
  );
}
