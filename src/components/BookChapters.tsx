import Link from "next/link";
import type { BookInfo } from "@/lib/books";
import { arabicDigits } from "@/lib/arabic";
import { chapterHref, type View } from "@/lib/navigation";

/** A book's title row and its grid of chapter links, for the home pages. */
export default function BookChapters({ book, view }: { book: BookInfo; view: View }) {
  const ar = view === "arabic";
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
        {ar ? (
          <h2 className="arabic text-2xl font-bold">{book.arabic}</h2>
        ) : (
          <>
            <h2 className="text-xl font-medium">{book.english}</h2>
            <span className="greek text-muted">{book.greek}</span>
            <Link href={`/ar/${book.slug}/1`} dir="rtl" lang="ar" className="arabic text-lg text-muted hover:text-accent">
              {book.arabic} ←
            </Link>
          </>
        )}
      </div>
      <ul className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-10">
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
          <li key={c}>
            <Link
              href={chapterHref(view, book.slug, c)}
              className="block rounded-md border border-line bg-surface py-2 text-center hover:border-accent hover:text-accent"
            >
              {ar ? arabicDigits(c) : c}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
