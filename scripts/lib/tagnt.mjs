// Reads an extracted TAGNT book (sources/tagnt/*.tsv) into per-verse candidate lists.
import { readFileSync } from "node:fs";

const clean = (s) => s.replace(/\s*\([^)]*\)\s*$/, "").trim(); // "λόγος, (logos)" -> "λόγος,"
const gloss = (s) => s.trim().replace(/[,.;:·!?]+$/, "");

/** Alternative readings from the "meaning variants" column, e.g. "υἱός (T=huios) son - G5207=N-NSM in: TR". */
function meaningVariants(col) {
  const out = [];
  for (const m of col.matchAll(/([^\s(;]+)\s*\([^)]*\)\s*([^-]*?)\s*-\s*(G\d+)\w*=([\w-]+)/g))
    out.push({ form: m[1], g: gloss(m[2]), strong: m[3], morph: m[4] });
  return out;
}

/** Map "chapter:verse" -> candidate words { form, strong, morph, lemma, g, all }. */
export function loadTagnt(path) {
  const verses = new Map();
  const add = (key, c) => (verses.get(key) ?? verses.set(key, []).get(key)).push(c);

  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const [ref, greek, english, sg, lg, editions = "", meaning = "", spelling = ""] = line.split("\t");
    const rm = /^\w+\.(\d+)\.(\d+)(?:\{(\d+)\.(\d+)\})?#\d+=(\S+)/.exec(ref);
    const sm = /^(G\d+)\w*=([\w-]+)/.exec(sg ?? "");
    if (!rm || !sm) continue;

    const base = {
      strong: sm[1],
      morph: sm[2],
      lemma: (lg ?? "").split("=")[0].trim(),
      g: gloss(english ?? ""),
      all: rm[5] === "NKO",
      editions,
    };
    const forms = [
      { ...base, form: clean(greek) },
      ...[...spelling.matchAll(/:\s*([^;]+?)\s*;/g)].map((m) => ({ ...base, form: m[1] })),
      ...meaningVariants(meaning).map((v) => ({ ...base, ...v, lemma: base.lemma, all: false })),
    ];
    const keys = [`${rm[1]}:${rm[2]}`];
    if (rm[3]) keys.push(`${rm[3]}:${rm[4]}`); // alternative versification
    // Group the forms of one TAGNT row so the aligner treats them as one slot.
    for (const key of keys) add(key, forms);
  }
  return verses;
}
