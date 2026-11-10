import Link from "next/link";
import type { Metadata } from "next";
import { BOOKS } from "@/lib/books";
import BookChapters from "@/components/BookChapters";
import Ornament from "@/components/Ornament";

export const metadata: Metadata = { title: "الأناجيل" };

/** Arabic home page: every book with its chapters, linking to the Arabic-only reader. */
export default function ArabicHome() {
  return (
    <main dir="rtl" lang="ar" className="arabic mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-center text-4xl font-bold text-accent">الأناجيل</h1>
      <Ornament className="mx-auto mt-5 w-40" />
      <p className="mt-6 text-center text-lg text-muted">
        اختر الأصحاح للقراءة.{" "}
        <Link href="/" lang="en" dir="ltr" className="font-sans text-sm hover:text-accent">
          Greek &amp; Arabic side by side
        </Link>
      </p>

      {BOOKS.map((b) => (
        <BookChapters key={b.slug} book={b} view="arabic" />
      ))}
    </main>
  );
}
