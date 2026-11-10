import Link from "next/link";
import type { BookInfo } from "@/lib/books";
import { BUTTON } from "@/lib/styles";
import AutoHideHeader from "./AutoHideHeader";
import ChapterNav from "./ChapterNav";
import MenuIcon from "./MenuIcon";

/** Top bar of the Arabic-only reader (slides away after 300px of scrolling) (inside a dir="rtl" page). */
export default function ArabicHeader({ book, chapter }: { book: BookInfo; chapter: number }) {
  return (
    <AutoHideHeader className="border-b border-line bg-background">
      <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2.5">
        <Link href="/ar" className={`flex items-center gap-2 justify-self-start px-3 py-0.5 text-lg ${BUTTON}`}>
          <MenuIcon /> الأناجيل
        </Link>
        <ChapterNav view="arabic" book={book} chapter={chapter} />
        <Link
          href={`/${book.slug}/${chapter}`}
          lang="en"
          dir="ltr"
          className={`justify-self-end px-3 py-1 font-sans text-sm ${BUTTON}`}
        >
          with Greek
        </Link>
      </div>
    </AutoHideHeader>
  );
}
