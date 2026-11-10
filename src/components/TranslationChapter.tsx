import { buildBlocks } from "@/lib/paragraphs";
import { LANG_STYLE, type Lang } from "@/lib/translations";
import type { TranslationBook } from "@/lib/types";
import ArabicChapterTitle from "./ArabicChapterTitle";
import { TranslationHeading, TranslationParagraph } from "./TranslationText";

/** One chapter of a translation: optional title (Arabic-only page), section headings and paragraphs. */
export default function TranslationChapter({
  text,
  lang,
  bookName,
  chapter,
  showTitle = false,
  extraBreaks = [],
}: {
  text: TranslationBook;
  lang: Lang;
  bookName: string;
  chapter: number;
  showTitle?: boolean;
  /** additional paragraph starts, so this text breaks where the Greek does */
  extraBreaks?: number[];
}) {
  const verses = text.chapters[String(chapter)] ?? {};
  const blocks = buildBlocks(text, String(chapter), [], extraBreaks);
  const s = LANG_STYLE[lang];

  return (
    <div dir={s.dir} lang={lang} className={s.font}>
      {showTitle && lang === "ar" && <ArabicChapterTitle bookName={bookName} chapter={chapter} />}

      {blocks.map((b, i) => (
        <section key={b.verses[0]} id={`${lang}-v${b.verses[0]}`} className="scroll-mt-24">
          {b.heading && (
            <TranslationHeading lang={lang} className={i === 0 ? "mb-4" : "mt-10 mb-4"}>
              {b.heading}
            </TranslationHeading>
          )}
          <TranslationParagraph
            lang={lang}
            verses={b.verses.map((n) => ({ n, text: verses[String(n)] }))}
            className={i > 0 && !b.heading ? "mt-4" : ""}
          />
        </section>
      ))}
    </div>
  );
}
