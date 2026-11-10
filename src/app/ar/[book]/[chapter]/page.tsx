import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BOOKS, getBook } from "@/lib/books";
import { loadArabic } from "@/lib/data";
import { arabicDigits, chapterTitle } from "@/lib/arabic";
import ArabicChapter from "@/components/ArabicChapter";
import ChapterMenu from "@/components/ChapterMenu";
import Ornament from "@/components/Ornament";
import Sheet from "@/components/Sheet";

type Params = { book: string; chapter: string };

export function generateStaticParams(): Params[] {
  return BOOKS.flatMap((b) =>
    Array.from({ length: b.chapters }, (_, i) => ({ book: b.slug, chapter: String(i + 1) })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { book, chapter } = await params;
  const info = getBook(book);
  return { title: info ? `${info.arabic} ${arabicDigits(Number(chapter))}` : undefined };
}

/** Arabic-only reading page, laid out like a printed book. */
export default async function ArabicChapterPage({ params }: { params: Promise<Params> }) {
  const { book, chapter } = await params;
  const info = getBook(book);
  const ch = Number(chapter);
  const arabic = loadArabic(book);
  if (!info || !arabic || !arabic.chapters[chapter]) notFound();

  return (
    <div dir="rtl" lang="ar" className="arabic min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/" className="text-lg hover:text-accent">
            {info.arabic}
          </Link>
          <ChapterMenu
            label={chapterTitle(ch)}
            current={ch}
            count={info.chapters}
            href={(c) => `/ar/${book}/${c}`}
            format={arabicDigits}
          />
          <Link href={`/${book}/${ch}`} lang="en" dir="ltr" className="font-sans text-sm text-muted hover:text-accent">
            with Greek
          </Link>
        </div>
      </header>

      <main className="sm:px-4 sm:py-10">
        <Sheet className="mx-auto max-w-[42rem] sm:px-14">
          <ArabicChapter arabic={arabic} bookName={info.arabic} chapter={ch} />

          <Ornament className="mx-auto mt-12 w-24" />

          <nav className="mt-10 flex items-center justify-between text-lg">
            {ch > 1 ? (
              <Link href={`/ar/${book}/${ch - 1}`} className="hover:text-accent">
                → {chapterTitle(ch - 1)}
              </Link>
            ) : (
              <span />
            )}
            {ch < info.chapters ? (
              <Link href={`/ar/${book}/${ch + 1}`} className="hover:text-accent">
                {chapterTitle(ch + 1)} ←
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </Sheet>

        <p lang="en" dir="ltr" className="mx-auto mt-6 mb-10 max-w-[42rem] px-6 text-center font-sans text-xs text-muted">
          {arabic.source}
        </p>
      </main>
    </div>
  );
}
