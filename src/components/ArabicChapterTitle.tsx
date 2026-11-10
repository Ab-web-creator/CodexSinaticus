import { chapterTitle } from "@/lib/arabic";
import Ornament from "./Ornament";

/**
 * Chapter heading for the Arabic-only page, as in a printed Bible: the book name with
 * ornaments opens the book (chapter 1); every chapter gets a modest chapter title.
 */
export default function ArabicChapterTitle({ bookName, chapter }: { bookName: string; chapter: number }) {
  if (chapter === 1)
    return (
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-accent">{bookName}</h1>
        <Ornament className="mx-auto mt-5 mb-5 w-40" />
        <h2 className="text-2xl font-bold text-accent">{chapterTitle(chapter)}</h2>
      </header>
    );
  return <h2 className="mb-8 text-center text-2xl font-bold text-accent">{chapterTitle(chapter)}</h2>;
}
