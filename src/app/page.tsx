import Link from "next/link";
import { BOOKS } from "@/lib/books";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Codex Sinaiticus <span className="text-muted">·</span>{" "}
        <span dir="rtl" lang="ar" className="arabic">الإنجيل بالعربية</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        The Greek text of Codex Sinaiticus beside an Arabic translation, verse by verse.
      </p>

      {BOOKS.map((b) => (
        <section key={b.slug} className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
            <h2 className="text-xl font-medium">{b.english}</h2>
            <span className="greek text-muted">{b.greek}</span>
            <span dir="rtl" lang="ar" className="arabic text-lg text-muted">{b.arabic}</span>
          </div>
          <ul className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-10">
            {Array.from({ length: b.chapters }, (_, i) => i + 1).map((c) => (
              <li key={c}>
                <Link
                  href={`/${b.slug}/${c}`}
                  className="block rounded-md border border-line bg-surface py-2 text-center hover:border-accent hover:text-accent"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
