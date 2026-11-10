import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BOOKS, getBook } from "@/lib/books";
import { loadArabic, loadGreek } from "@/lib/data";
import { chapterTitle } from "@/lib/arabic";
import { buildBlocks, type Block } from "@/lib/paragraphs";
import ArabicChapter from "@/components/ArabicChapter";
import ChapterMenu from "@/components/ChapterMenu";
import GreekChapter from "@/components/GreekChapter";
import ScriptToggle from "@/components/ScriptToggle";
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
  return { title: info ? `${info.english} ${chapter} · Codex Sinaiticus · Arabic` : undefined };
}

export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const { book, chapter } = await params;
  const info = getBook(book);
  const ch = Number(chapter);
  if (!info || !Number.isInteger(ch) || ch < 1 || ch > info.chapters) notFound();

  const greek = loadGreek(book);
  const arabic = loadArabic(book);
  const greekNums = (greek?.chapters[chapter] ?? []).map((v) => v.v);

  // The Greek follows the Arabic paragraphing for now; without Arabic it is one paragraph.
  const greekBlocks: Block[] = arabic
    ? buildBlocks(arabic, chapter, greekNums)
    : [{ verses: greekNums }];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/" className="text-sm text-muted hover:text-accent">
            ← Books
          </Link>
          <ChapterMenu
            label={`${info.english} ${ch}`}
            current={ch}
            count={info.chapters}
            href={(c) => `/${book}/${c}`}
          />
          <div className="flex items-center gap-3">
            <ScriptToggle />
            {arabic && (
              <Link href={`/ar/${book}/${ch}`} dir="rtl" lang="ar" className="arabic text-lg text-muted hover:text-accent">
                العربية فقط
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl sm:px-4 sm:py-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <Sheet className="sm:px-10" aria-label="Codex Sinaiticus (Greek)">
            {greek ? (
              <GreekChapter greek={greek} bookTitle={info.greek} chapter={ch} blocks={greekBlocks} />
            ) : (
              <p className="text-muted">Greek text not available for this book yet.</p>
            )}
          </Sheet>
          <Sheet className="sm:px-10" aria-label="Arabic translation">
            {arabic ? (
              <ArabicChapter arabic={arabic} bookName={info.arabic} chapter={ch} />
            ) : (
              <p className="text-muted">The Arabic text for this book has not been added yet.</p>
            )}
          </Sheet>
        </div>

        <nav className="mt-10 grid grid-cols-2 border-t border-line px-6 pt-6 sm:px-0">
          <span>
            {ch > 1 && (
              <Link href={`/${book}/${ch - 1}`} className="hover:text-accent">
                ← {info.english} {ch - 1}{" "}
                <span dir="rtl" lang="ar" className="arabic text-muted">({chapterTitle(ch - 1)})</span>
              </Link>
            )}
          </span>
          <span className="text-end">
            {ch < info.chapters && (
              <Link href={`/${book}/${ch + 1}`} className="hover:text-accent">
                <span dir="rtl" lang="ar" className="arabic text-muted">({chapterTitle(ch + 1)})</span>{" "}
                {info.english} {ch + 1} →
              </Link>
            )}
          </span>
        </nav>

        <footer className="mt-8 mb-10 space-y-1 px-6 text-xs text-muted sm:px-0">
          {greek && <p>Greek: {greek.source}</p>}
          {arabic && <p>Arabic: {arabic.source}</p>}
        </footer>
      </main>
    </div>
  );
}
