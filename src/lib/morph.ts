// Turns Robinson-style morphology codes (as used by TAGNT) into plain English,
// e.g. "V-IAI-3S" -> "verb, imperfect active indicative, 3rd person singular".

const POS: Record<string, string> = {
  N: "noun", V: "verb", A: "adjective", T: "article", P: "personal pronoun", R: "relative pronoun",
  D: "demonstrative pronoun", I: "interrogative pronoun", X: "indefinite pronoun", Q: "correlative pronoun",
  K: "correlative pronoun", F: "reflexive pronoun", S: "possessive pronoun", C: "reciprocal pronoun",
  PREP: "preposition", CONJ: "conjunction", ADV: "adverb", PRT: "particle", INJ: "interjection",
  COND: "conditional", HEB: "Hebrew word", ARAM: "Aramaic word",
};
const CASE: Record<string, string> = { N: "nominative", G: "genitive", D: "dative", A: "accusative", V: "vocative" };
const NUM: Record<string, string> = { S: "singular", P: "plural" };
const GEN: Record<string, string> = { M: "masculine", F: "feminine", N: "neuter" };
const TENSE: Record<string, string> = { P: "present", I: "imperfect", F: "future", A: "aorist", R: "perfect", L: "pluperfect" };
const VOICE: Record<string, string> = { A: "active", M: "middle", P: "passive", E: "middle/passive", D: "middle deponent", O: "passive deponent", N: "middle/passive deponent" };
const MOOD: Record<string, string> = { I: "indicative", S: "subjunctive", O: "optative", M: "imperative", N: "infinitive", P: "participle" };
const SUFFIX: Record<string, string> = { N: "negative", I: "interrogative", C: "contracted", S: "superlative", T: "title", P: "proper name", L: "location", ATT: "Attic form" };

const person = (p: string) => ({ "1": "1st person", "2": "2nd person", "3": "3rd person" })[p];

/** Case/number/gender block like "NSM" (or "1GS" with a leading person for pronouns). */
function nominal(block: string): string[] {
  const m = /^([123])?([NGDAV])([SP])([MFN])?$/.exec(block);
  if (!m) return [];
  return [m[1] && person(m[1]), CASE[m[2]], NUM[m[3]], m[4] && GEN[m[4]]].filter(Boolean) as string[];
}

function verb(rest: string[]): string[] {
  const m = /^2?([PIFARL])([AMPEDON])([ISOMNP])$/.exec(rest[0] ?? "");
  if (!m) return [];
  const parts = [`${TENSE[m[1]]} ${VOICE[m[2]]} ${MOOD[m[3]]}`];
  const tail = rest[1] ?? "";
  const pn = /^([123])([SP])$/.exec(tail);
  if (pn) parts.push(`${person(pn[1])} ${NUM[pn[2]]}`);
  else parts.push(...nominal(tail));
  return parts;
}

export function describeMorph(code: string): string {
  const [head, ...rest] = code.split("-");
  const pos = POS[head];
  if (!pos) return code;
  const parts = [pos, ...(head === "V" ? verb(rest) : rest.flatMap((r) => nominal(r)))];
  for (const r of rest) if (SUFFIX[r]) parts.push(SUFFIX[r]);
  return parts.join(", ");
}
