import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBook } from "@/lib/books";
import { loadTranslation } from "@/lib/data";
import { arabicDigits } from "@/lib/arabic";
import { allChapterParams } from "@/lib/navigation";
import TranslationChapter from "@/components/TranslationChapter";
import ArabicHeader from "@/components/ArabicHeader";
import Ornament from "@/components/Ornament";
import PrevNextNav from "@/components/PrevNextNav";
import Sheet from "@/components/Sheet";

type Params = { book: string; chapter: string };

export const generateStaticParams = allChapterParams;
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
  const arabic = loadTranslation("ar", book);
  if (!info || !arabic || !arabic.chapters[chapter]) notFound();

  return (
    <div dir="rtl" lang="ar" className="arabic min-h-screen">
      <ArabicHeader book={info} chapter={ch} />

      <main className="mx-auto max-w-3xl sm:px-4 sm:py-10">
        <Sheet className="sm:px-14">
          <TranslationChapter text={arabic} lang="ar" bookName={info.arabic} chapter={ch} showTitle />
          <Ornament className="mx-auto mt-12 w-24" />
          <PrevNextNav view="arabic" book={book} chapter={ch} className="mt-10 text-lg" />
        </Sheet>

        <p lang="en" dir="ltr" className="mt-6 mb-10 px-6 text-center font-sans text-xs text-muted">
          {arabic.source}
        </p>
      </main>
    </div>
  );
}
