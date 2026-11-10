import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBook } from "@/lib/books";
import { loadGreek, loadInterlinear, loadTranslation } from "@/lib/data";
import { LANGS } from "@/lib/translations";
import { allChapterParams } from "@/lib/navigation";
import { buildBlocks, type Block } from "@/lib/paragraphs";
import GreekChapter from "@/components/GreekChapter";
import ParallelHeader from "@/components/ParallelHeader";
import PrevNextNav from "@/components/PrevNextNav";
import ScrollSync from "@/components/ScrollSync";
import Sheet from "@/components/Sheet";
import TranslationPanels from "@/components/TranslationPanels";

type Params = { book: string; chapter: string };

export const generateStaticParams = allChapterParams;
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
  const interlinear = loadInterlinear(book);
  const texts = LANGS.flatMap((lang) => {
    const text = loadTranslation(lang, book);
    return text ? [{ lang, text }] : [];
  });
  const arabic = texts.find((t) => t.lang === "ar")?.text;
  const greekNums = (greek?.chapters[chapter] ?? []).map((v) => v.v);
  // The Greek follows the Arabic paragraphing for now; without it, one paragraph.
  const greekBlocks: Block[] = arabic ? buildBlocks(arabic, chapter, greekNums) : [{ verses: greekNums }];

  return (
    <div className="min-h-screen">
      <ParallelHeader book={info} chapter={ch} hasArabic={!!arabic} />

      <main className="mx-auto max-w-7xl sm:px-4 sm:py-10">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <Sheet className="sm:px-10" aria-label="Codex Sinaiticus (Greek)">
            {greek ? (
              <GreekChapter greek={greek} chapter={ch} blocks={greekBlocks} interlinear={interlinear} />
            ) : (
              <p className="text-muted">Greek text not available for this book yet.</p>
            )}
          </Sheet>
          <Sheet className="sm:px-10" aria-label="Translation">
            <TranslationPanels texts={texts} book={info} chapter={ch} breaks={greekBlocks.map((b) => b.verses[0])} />
          </Sheet>
        </div>

        <ScrollSync />

        <PrevNextNav view="parallel" book={book} chapter={ch} className="mt-10 border-t border-line px-6 pt-6 sm:px-0" />

        <footer className="mt-8 mb-10 space-y-1 px-6 text-xs text-muted sm:px-0">
          {greek && <p>Greek: {greek.source}</p>}
          {interlinear && <p>Interlinear: {interlinear.source}</p>}
          {texts.map(({ lang, text }) => (
            <p key={lang}>
              {lang === "ar" ? "Arabic" : "Dutch"}: {text.source}
            </p>
          ))}
        </footer>
      </main>
    </div>
  );
}
