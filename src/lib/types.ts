// Shapes of the generated JSON in src/data. See scripts/build-*.mjs.

/** A run of letters in a Greek word. o = overlined (nomen sacrum), x = letters supplied to expand an abbreviation. */
export type Seg = { t: string; o?: 1; x?: 1 };

export type CorrectionReading = { h: string; t: GreekToken[] };

export type GreekToken =
  | { w: Seg[] }
  | { p: string }
  | { c: { orig: GreekToken[]; corr: CorrectionReading[] } };

export type GreekVerse = { v: number; f: string | null; t: GreekToken[] };

export type GreekBook = {
  book: string;
  witness: string;
  source: string;
  chapters: Record<string, GreekVerse[]>;
};

export type ArabicBook = {
  book: string;
  /** Arabic display name of the translation, e.g. "ترجمة فان دايك" */
  name: string;
  source: string;
  /** chapter -> verse -> text */
  chapters: Record<string, Record<string, string>>;
  /** optional section headings shown before a verse: chapter -> verse -> heading */
  headings?: Record<string, Record<string, string>>;
  /** optional paragraph starts: chapter -> verse numbers that begin a paragraph */
  paragraphs?: Record<string, number[]>;
};
