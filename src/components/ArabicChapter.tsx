import { chapterTitle } from "@/lib/arabic";
import { buildBlocks } from "@/lib/paragraphs";
import type { ArabicBook } from "@/lib/types";
import Ornament from "./Ornament";
import { ArabicHeading, ArabicParagraph } from "./ArabicText";

/** The Arabic chapter as a book page: title, ornaments, headings and paragraphs. */
export default function ArabicChapter({
  arabic,
  bookName,
  chapter,
}: {
  arabic: ArabicBook;
  bookName: string;
  chapter: number;
}) {
  const verses = arabic.chapters[String(chapter)] ?? {};
  const blocks = buildBlocks(arabic, String(chapter));

  return (
    <div dir="rtl" lang="ar" className="arabic">
      <p className="text-center text-lg tracking-wide text-muted">{bookName}</p>
      <Ornament className="mx-auto mt-4 mb-5 w-40" />
      <h1 className="text-center text-4xl font-bold text-accent">{chapterTitle(chapter)}</h1>
      <Ornament className="mx-auto mt-5 mb-10 w-40" />

      {blocks.map((b, i) => (
        <section key={b.verses[0]} id={`ar-v${b.verses[0]}`} className="scroll-mt-24">
          {b.heading && <ArabicHeading className={i === 0 ? "mb-4" : "mt-10 mb-4"}>{b.heading}</ArabicHeading>}
          <ArabicParagraph
            verses={b.verses.map((n) => ({ n, text: verses[String(n)] }))}
            className={i > 0 && !b.heading ? "mt-4" : ""}
          />
        </section>
      ))}
    </div>
  );
}
