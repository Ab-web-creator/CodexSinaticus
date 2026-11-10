#!/usr/bin/env node
// Builds word-by-word interlinear data for the Greek, by aligning each first-hand
// Sinaiticus word with TAGNT (STEPBible, CC BY 4.0) words of the same verse.
//
// Usage: node scripts/build-interlinear.mjs <bookSlug> <TAGNT code>   e.g. john JHN
// Output: src/data/interlinear/<bookSlug>.json
//   { chapters: { [ch]: { [v]: (Entry | 0)[] } } }, one slot per first-hand word, in order.
//   Entry = { s: Strong's, m: morphology code, l: lemma, g: { en: gloss }, a?: 1 }
//   a = approximate: the word is not in TAGNT for this verse; looked up by spelling elsewhere.
// Glosses are keyed by language so more languages can be added beside "en".

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { align } from "./lib/align.mjs";
import { similarity, skeleton } from "./lib/greek-match.mjs";
import { loadTagnt } from "./lib/tagnt.mjs";

const [book, code] = process.argv.slice(2);
if (!book || !code) {
  console.error("Usage: node scripts/build-interlinear.mjs <bookSlug> <TAGNT code>");
  process.exit(1);
}

const greek = JSON.parse(readFileSync(`src/data/greek/${book}.json`, "utf8"));
const tagnt = loadTagnt(`sources/tagnt/${code}.tsv`);

// Fallback for Sinaiticus-only readings: the most frequent TAGNT entry for each spelling skeleton.
const lexicon = new Map();
for (const c of ["MAT", "MRK", "JHN"])
  for (const slots of loadTagnt(`sources/tagnt/${c}.tsv`).values())
    for (const slot of slots)
      for (const f of slot) {
        const k = skeleton(f.form);
        const byForm = lexicon.get(k) ?? lexicon.set(k, new Map()).get(k);
        const id = `${f.strong}|${f.morph}`;
        byForm.set(id, { f, n: (byForm.get(id)?.n ?? 0) + 1 });
      }
const lookup = (w) => {
  for (const t of spellings(w)) {
    const hits = lexicon.get(skeleton(t));
    if (hits) return [...hits.values()].sort((a, b) => b.n - a.n)[0].f;
  }
  return null;
};

/** First-hand words of a verse, in reading order (same order the reader renders them). */
function firstHandWords(tokens, out = []) {
  for (const t of tokens) {
    if (t.w) out.push({ text: t.w.map((s) => s.t).join(""), abbr: t.w.some((s) => s.o) });
    else if (t.c) firstHandWords(t.c.orig, out);
  }
  return out;
}

/** Spellings to try: a macron (IGNTP) or an overlined final letter (CSP) can stand for a dropped ν. */
const spellings = (w) => [...new Set([w.text, w.text.replace(/¯/g, "ν"), ...(w.abbr ? [w.text + "ν"] : [])])];

function bestForm(word, slot) {
  let best = { score: 0, form: null };
  for (const f of slot) {
    let s = similarity(word.text, f, word.abbr);
    if (!s) s = Math.max(...spellings(word).map((t) => similarity(t, f, false)));
    if (f.all) s += 0.01; // prefer readings shared by all editions
    if (s > best.score) best = { score: s, form: f };
  }
  return best;
}

let total = 0;
let matched = 0;
let approx = 0;
const unmatched = [];
const chapters = {};

for (const [ch, verses] of Object.entries(greek.chapters)) {
  for (const verse of verses) {
    const words = firstHandWords(verse.t);
    if (!words.length) continue;
    const slots = tagnt.get(`${ch}:${verse.v}`) ?? [];
    const cache = new Map();
    const pick = (i, j) => {
      const k = i * 1000 + j;
      if (!cache.has(k)) cache.set(k, bestForm(words[i], slots[j]));
      return cache.get(k);
    };
    const map = align(words.length, slots.length, (i, j) => pick(i, j).score);
    // Second pass for word-order differences: exact matches into any unused slot.
    const used = new Set(map.filter((j) => j >= 0));
    map.forEach((j, i) => {
      if (j >= 0) return;
      const k = slots.findIndex((_, s) => !used.has(s) && pick(i, s).score >= 0.9);
      if (k >= 0) {
        map[i] = k;
        used.add(k);
      }
    });

    (chapters[ch] ??= {})[verse.v] = map.map((j, i) => {
      total++;
      if (j >= 0) {
        matched++;
        const f = pick(i, j).form;
        return { s: f.strong, m: f.morph, l: f.lemma, g: { en: f.g } };
      }
      const f = lookup(words[i]);
      if (f) {
        approx++;
        return { s: f.strong, m: f.morph, l: f.lemma, g: { en: f.g }, a: 1 }; // a = approximate, not from this verse
      }
      unmatched.push(`${ch}:${verse.v} ${words[i].text}`);
      return 0;
    });
  }
}

mkdirSync("src/data/interlinear", { recursive: true });
const dest = `src/data/interlinear/${book}.json`;
writeFileSync(
  dest,
  JSON.stringify({
    book,
    source: "Lemmas, morphology and English glosses from TAGNT, STEPBible.org (Tyndale House), CC BY 4.0; aligned automatically to the Sinaiticus text.",
    chapters,
  }),
);
const pct = (n) => ((100 * n) / total).toFixed(1) + "%";
console.log(`Wrote ${dest}: ${total} words, ${pct(matched)} aligned, ${pct(approx)} by spelling lookup, ${unmatched.length} without gloss`);
if (process.env.VERBOSE) for (const u of unmatched) console.log("  unmatched", u);
