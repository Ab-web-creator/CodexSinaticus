import Link from "next/link";
import type { BookInfo } from "@/lib/books";
import { BUTTON, TOGGLE } from "@/lib/styles";
import AutoHideHeader from "./AutoHideHeader";
import ChapterNav from "./ChapterNav";
import InterlinearToggle from "./InterlinearToggle";
import MenuIcon from "./MenuIcon";
import ScriptToggle from "./ScriptToggle";
import TranslationSwitch from "./TranslationSwitch";

/** Top bar of the side-by-side reader (slides away after 300px of scrolling). */
export default function ParallelHeader({ book, chapter, hasArabic }: { book: BookInfo; chapter: number; hasArabic: boolean }) {
  return (
    <AutoHideHeader className="border-b border-line bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2.5">
        {/* Left, over the Greek page: book menu and Greek display controls. */}
        <div className="flex items-center justify-self-start gap-2">
          <Link href="/" className={`flex items-center gap-2 px-3 py-1 text-sm ${BUTTON}`}>
            <MenuIcon /> Books
          </Link>
          <InterlinearToggle />
          <ScriptToggle />
        </div>
        <ChapterNav view="parallel" book={book} chapter={chapter} />
        {/* Right, over the translation page: Arabic book menu, Arabic-only view, translation switch. */}
        <div dir="rtl" lang="ar" className="arabic flex items-center justify-self-end gap-2">
          <Link href="/ar" className={`flex items-center gap-2 px-3 py-0.5 text-lg ${BUTTON}`}>
            <MenuIcon /> الأناجيل
          </Link>
          <TranslationSwitch />
          {hasArabic && (
            <Link href={`/ar/${book.slug}/${chapter}`} className={`hidden px-3 py-0.5 text-lg sm:inline-block ${TOGGLE}`}>
              العربية فقط
            </Link>
          )}
        </div>
      </div>
    </AutoHideHeader>
  );
}
