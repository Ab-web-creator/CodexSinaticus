import { LANG_STYLE, type Lang } from "@/lib/translations";

/** Centred section heading with thin rules on both sides. */
export function TranslationHeading({ lang, children, className = "" }: { lang: Lang; children: React.ReactNode; className?: string }) {
  const s = LANG_STYLE[lang];
  return (
    <h2 dir={s.dir} lang={lang} className={`${s.font} flex items-center gap-4 text-center text-xl font-bold text-accent ${className}`}>
      <span className="h-px flex-1 bg-line" aria-hidden />
      <span>{children}</span>
      <span className="h-px flex-1 bg-line" aria-hidden />
    </h2>
  );
}

/** A paragraph of verses with small inline verse numbers. */
export function TranslationParagraph({
  lang,
  verses,
  className = "",
}: {
  lang: Lang;
  verses: { n: number; text: string }[];
  className?: string;
}) {
  const s = LANG_STYLE[lang];
  return (
    <p dir={s.dir} lang={lang} className={`${s.font} ${s.body} ${className}`}>
      {verses.map((v) => (
        <span key={v.n} data-v={v.n}>
          <sup className="mx-0.5 text-[0.6em] font-bold text-accent">{s.number(v.n)}</sup>
          {v.text}{" "}
        </span>
      ))}
    </p>
  );
}
