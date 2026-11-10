// Fuzzy comparison of Sinaiticus spellings with standard (accented) Greek forms.

/**
 * Reduces a word to a rough phonetic skeleton: no accents or breathings, final ς as σ,
 * itacism collapsed (ει/η/οι/υ -> ι), αι -> ε, ω -> ο, double consonants single.
 */
export function skeleton(word) {
  return word
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ς/g, "σ")
    .replace(/ου/g, "u")
    .replace(/[^α-ωu]/g, "")
    .replace(/ει|οι|υι|η|υ/g, "ι")
    .replace(/αι/g, "ε")
    .replace(/ω/g, "ο")
    .replace(/([βγδζθκλμνπρστφχψ])\1/g, "$1");
}

/** Letters only: no accents, breathings or punctuation; final ς as σ. */
const plain = (word) =>
  word.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ς/g, "σ").replace(/[^α-ω]/g, "");

function levenshtein(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** Strong's numbers of words written as nomina sacra (abbreviated sacred names). */
const SACRED = new Set([
  "G2424", "G5547", "G2316", "G2962", "G3962", "G0444", "G5207", "G4151", "G4990",
  "G1138", "G2474", "G2419", "G4716", "G4717", "G3384", "G3772", "G2475", "G2414",
]);

/**
 * Similarity 0..1 between a Sinaiticus word and a candidate form.
 * Abbreviated sacred names match on first and last letter plus a sacred Strong's number.
 */
export function similarity(src, { form, strong }, abbreviated) {
  if (abbreviated) {
    const p = plain(src);
    const q = plain(form);
    return SACRED.has(strong) && p && q && p[0] === q[0] && p.at(-1) === q.at(-1) ? 0.9 : 0;
  }
  const a = skeleton(src);
  const b = skeleton(form);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (Math.max(a.length, b.length) <= 3) return 0; // short words must match exactly
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}
