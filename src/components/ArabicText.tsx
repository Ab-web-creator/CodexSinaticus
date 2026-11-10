import { arabicDigits } from "@/lib/arabic";

export function ArabicHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 dir="rtl" lang="ar" className={`arabic flex items-center gap-4 text-center text-xl font-bold text-accent ${className}`}>
      <span className="h-px flex-1 bg-line" aria-hidden />
      <span>{children}</span>
      <span className="h-px flex-1 bg-line" aria-hidden />
    </h2>
  );
}

export function ArabicParagraph({
  verses,
  className = "",
}: {
  verses: { n: number; text: string }[];
  className?: string;
}) {
  return (
    <p dir="rtl" lang="ar" className={`arabic text-justify text-[1.45rem] leading-[2.35] ${className}`}>
      {verses.map((v) => (
        <span key={v.n}>
          <sup className="mx-0.5 text-[0.6em] font-bold text-accent">{arabicDigits(v.n)}</sup>
          {v.text}{" "}
        </span>
      ))}
    </p>
  );
}
