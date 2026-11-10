import { arabicDigits } from "./arabic";

/** Translations shown on the right-hand page. The first one is the default. */
export const LANGS = ["nl", "ar"] as const;
export type Lang = (typeof LANGS)[number];

type LangStyle = {
  /** name of the language in itself, for the switch */
  label: string;
  dir: "ltr" | "rtl";
  /** font class (see globals.css) */
  font: string;
  /** size, line height and alignment of paragraphs */
  body: string;
  /** how verse numbers are written */
  number: (n: number) => string;
};

export const LANG_STYLE: Record<Lang, LangStyle> = {
  nl: {
    label: "Nederlands",
    dir: "ltr",
    font: "dutch",
    body: "text-justify hyphens-auto text-[1.2rem] leading-[1.9]",
    number: String,
  },
  ar: {
    label: "العربية",
    dir: "rtl",
    font: "arabic",
    body: "text-justify text-[1.45rem] leading-[2.35]",
    number: arabicDigits,
  },
};
