export type BookInfo = {
  slug: string;
  english: string;
  greek: string;
  arabic: string;
  chapters: number;
};

// In reading order. Add a book here once its data has been generated (npm run build:data).
export const BOOKS: BookInfo[] = [
  { slug: "matthew", english: "Matthew", greek: "ΚΑΤΑ ΜΑΘΘΑΙΟΝ", arabic: "إنجيل متى", chapters: 28 },
  { slug: "mark", english: "Mark", greek: "ΚΑΤΑ ΜΑΡΚΟΝ", arabic: "إنجيل مرقس", chapters: 16 },
  { slug: "john", english: "John", greek: "ΚΑΤΑ ΙΩΑΝΝΗΝ", arabic: "إنجيل يوحنا", chapters: 21 },
];

export const getBook = (slug: string) => BOOKS.find((b) => b.slug === slug);

/** Display names for the hands recorded in the transcriptions (IGNTP and Codex Sinaiticus Project). */
export const HANDS: Record<string, string> = {
  firsthand: "First hand",
  S1: "Original scribe’s correction (S1)",
  S2: "Original scribe’s correction (S2)",
  A: "Scribe A",
  D: "Scribe D",
  ca: "Corrector ca",
  cb2: "Corrector cb2",
  c: "Corrector c",
  e: "Corrector e",
  corr: "Corrector (unidentified)",
  correctorca: "Corrector ca",
  correctorcb: "Corrector cb",
  correctorcb2: "Corrector cb2",
  corrector: "Corrector (unidentified)",
};
