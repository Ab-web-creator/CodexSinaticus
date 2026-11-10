import Link from "next/link";
import { BOOKS } from "@/lib/books";
import BookChapters from "@/components/BookChapters";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Codex Sinaiticus <span className="text-muted">·</span>{" "}
        <span dir="rtl" lang="ar" className="arabic">الإنجيل بالعربية</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        The Greek text of Codex Sinaiticus beside an Arabic translation. Pick a chapter to read
        both side by side, or{" "}
        <Link href="/ar" className="text-accent hover:underline">
          read the Arabic on its own
        </Link>
        .
      </p>

      {BOOKS.map((b) => (
        <BookChapters key={b.slug} book={b} view="parallel" />
      ))}
    </main>
  );
}
