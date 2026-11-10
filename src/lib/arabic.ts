const UNITS = ["", "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع"];
const UNITS_COMPOUND = ["", "الحادي", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع"];

/** Ordinal for a chapter title, e.g. 1 -> "الأول", 12 -> "الثاني عشر", 21 -> "الحادي والعشرون". Covers 1–29. */
export function arabicOrdinal(n: number): string {
  if (n < 10) return UNITS[n];
  if (n === 10) return "العاشر";
  if (n < 20) return `${UNITS_COMPOUND[n - 10]} عشر`;
  if (n === 20) return "العشرون";
  if (n < 30) return `${UNITS_COMPOUND[n - 20]} والعشرون`;
  return String(n);
}

const digits = new Intl.NumberFormat("ar-EG", { useGrouping: false });
export const arabicDigits = (n: number) => digits.format(n);

export const chapterTitle = (c: number) => `الأصحاح ${arabicOrdinal(c)}`;

/** Greek alphabetic numeral with keraia, e.g. 2 -> "βʹ", 21 -> "καʹ". Covers 1–99. */
export function greekNumeral(n: number): string {
  const units = ["", "α", "β", "γ", "δ", "ε", "ϛ", "ζ", "η", "θ"];
  const tens = ["", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ϟ"];
  return `${tens[Math.floor(n / 10) % 10]}${units[n % 10]}ʹ`;
}
