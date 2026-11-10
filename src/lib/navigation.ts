import { arabicDigits } from "./arabic";
import { BOOKS, type BookInfo } from "./books";

export type View = "parallel" | "arabic";
export type ChapterRef = { book: BookInfo; chapter: number };

/** URL of a chapter in the given view. */
export const chapterHref = (view: View, slug: string, chapter: number) =>
  view === "arabic" ? `/ar/${slug}/${chapter}` : `/${slug}/${chapter}`;

/** Label of the chapter menu, e.g. "John 1" or "إنجيل يوحنا ١". */
export const chapterLabel = (view: View, book: BookInfo, chapter: number) =>
  view === "arabic" ? `${book.arabic} ${arabicDigits(chapter)}` : `${book.english} ${chapter}`;

/** Previous and next chapter, crossing into the neighbouring book at either end. */
export function adjacentChapters(slug: string, chapter: number): { prev?: ChapterRef; next?: ChapterRef } {
  const i = BOOKS.findIndex((b) => b.slug === slug);
  if (i < 0) return {};
  const book = BOOKS[i];
  const prevBook = BOOKS[i - 1];
  const nextBook = BOOKS[i + 1];
  return {
    prev:
      chapter > 1
        ? { book, chapter: chapter - 1 }
        : prevBook && { book: prevBook, chapter: prevBook.chapters },
    next:
      chapter < book.chapters
        ? { book, chapter: chapter + 1 }
        : nextBook && { book: nextBook, chapter: 1 },
  };
}

/** Every (book, chapter) pair, for generateStaticParams. */
export const allChapterParams = () =>
  BOOKS.flatMap((b) =>
    Array.from({ length: b.chapters }, (_, i) => ({ book: b.slug, chapter: String(i + 1) })),
  );
