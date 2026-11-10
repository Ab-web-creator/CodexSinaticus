import type { BookInfo } from "@/lib/books";
import type { Lang } from "@/lib/translations";
import type { TranslationBook } from "@/lib/types";
import TranslationChapter from "./TranslationChapter";

/**
 * All translations of a chapter, each in a .tr-{lang} wrapper. CSS shows only the one
 * selected by the translation switch (Dutch unless html[data-arabic="true"]).
 */
export default function TranslationPanels({
  texts,
  book,
  chapter,
  breaks,
}: {
  texts: { lang: Lang; text: TranslationBook }[];
  book: BookInfo;
  chapter: number;
  /** paragraph starts shared with the Greek page */
  breaks: number[];
}) {
  if (!texts.length) return <p className="text-muted">No translation available for this book yet.</p>;
  return (
    <div data-sync-col>
      {texts.map(({ lang, text }) => (
        <div key={lang} className={`tr-${lang}`}>
          <TranslationChapter text={text} lang={lang} bookName={lang === "ar" ? book.arabic : book.english} chapter={chapter} extraBreaks={breaks} />
        </div>
      ))}
    </div>
  );
}
