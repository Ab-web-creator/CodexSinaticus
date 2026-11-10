"use client";

import { LANG_STYLE } from "@/lib/translations";
import { useHtmlFlag } from "@/lib/useHtmlFlag";

/**
 * Chooses the translation on the right-hand page: Dutch by default, Arabic when the
 * "arabic" flag is set. The choice is remembered on the device (see useHtmlFlag).
 */
export default function TranslationSwitch() {
  const [arabic, setArabic] = useHtmlFlag("arabic");

  const option = (value: boolean, lang: "nl" | "ar", extra: string) => (
    <button
      type="button"
      onClick={() => setArabic(value)}
      aria-pressed={arabic === value}
      lang={lang}
      className={`px-2.5 py-0.5 ${extra} ${arabic === value ? "bg-panel text-accent" : "text-muted hover:text-foreground"}`}
    >
      {LANG_STYLE[lang].label}
    </button>
  );

  return (
    <div dir="ltr" role="group" aria-label="Translation" className="flex overflow-hidden rounded-md border border-line">
      {option(false, "nl", "font-sans text-sm")}
      {option(true, "ar", "arabic text-lg")}
    </div>
  );
}
