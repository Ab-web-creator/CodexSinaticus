export type BookInfo = {
  slug: string;
  english: string;
  greek: string;
  arabic: string;
  chapters: number;
};

// Add a book here once its Greek (and ideally Arabic) data has been generated.
export const BOOKS: BookInfo[] = [
  { slug: "john", english: "John", greek: "ΚΑΤΑ ΙΩΑΝΝΗΝ", arabic: "إنجيل يوحنا", chapters: 21 },
];

export const getBook = (slug: string) => BOOKS.find((b) => b.slug === slug);

/** Display names for the hands recorded in the IGNTP transcription. */
export const HANDS: Record<string, string> = {
  firsthand: "First hand",
  S1: "Original scribe’s correction (S1)",
  S2: "Original scribe’s correction (S2)",
  correctorca: "Corrector ca",
  correctorcb: "Corrector cb",
  correctorcb2: "Corrector cb2",
  corrector: "Corrector (unidentified)",
};
