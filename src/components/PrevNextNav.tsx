import Link from "next/link";
import { chapterTitle } from "@/lib/arabic";
import { getBook } from "@/lib/books";
import { adjacentChapters, chapterHref, chapterLabel, type ChapterRef, type View } from "@/lib/navigation";
import { BUTTON } from "@/lib/styles";
import ChapterMenu from "./ChapterMenu";

/**
 * Bottom-of-page bar: previous chapter, the chapter menu (centred, no arrows), next chapter.
 * Previous/next cross book boundaries.
 */
export default function PrevNextNav({
  view,
  book,
  chapter,
  className = "",
}: {
  view: View;
  book: string;
  chapter: number;
  className?: string;
}) {
  const info = getBook(book);
  const { prev, next } = adjacentChapters(book, chapter);
  const ar = view === "arabic";
  const name = (to: ChapterRef) =>
    ar
      ? to.book.slug === book
        ? chapterTitle(to.chapter)
        : `${to.book.arabic}، ${chapterTitle(to.chapter)}`
      : `${to.book.english} ${to.chapter}`;

  const button = `${BUTTON} px-4 py-2`;

  return (
    <nav className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 ${className}`}>
      {prev ? (
        <Link href={chapterHref(view, prev.book.slug, prev.chapter)} className={`justify-self-start ${button}`}>
          {ar ? "→" : "←"} {name(prev)}
        </Link>
      ) : (
        <span />
      )}
      {info ? <ChapterMenu view={view} book={book} chapter={chapter} label={chapterLabel(view, info, chapter)} up /> : <span />}
      {next ? (
        <Link href={chapterHref(view, next.book.slug, next.chapter)} className={`justify-self-end text-end ${button}`}>
          {name(next)} {ar ? "←" : "→"}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
