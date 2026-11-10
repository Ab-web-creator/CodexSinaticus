// Small helpers shared by the XML import scripts.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/** Matches comments, doctype, processing instructions, tags (groups 1–4) and text (group 5). */
export const TOKEN_RE =
  /<!--[\s\S]*?-->|<!DOCTYPE[\s\S]*?\]>|<\?[\s\S]*?\?>|<(\/?)([\w:]+)([^>]*?)(\/?)>|([^<]+)/g;

export const decode = (s) =>
  s
    .replace(/&om;/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

export const attrs = (s) => {
  const out = {};
  for (const m of (s || "").matchAll(/([\w:]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
};

/** Appends text to a word's segments, merging with the previous segment when formatting matches. */
export function pushSeg(word, t, fmt) {
  const seg = { t };
  if (fmt.o) seg.o = 1;
  if (fmt.x) seg.x = 1;
  const last = word[word.length - 1];
  if (last && !!last.o === !!seg.o && !!last.x === !!seg.x) last.t += t;
  else word.push(seg);
}

/** Writes the reader's Greek JSON and prints a summary. */
export function writeGreek(book, witness, source, chapters, warnings = []) {
  const dest = `src/data/greek/${book}.json`;
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, JSON.stringify({ book, witness, source, chapters }));
  const n = Object.values(chapters).reduce((a, l) => a + l.length, 0);
  console.log(`Wrote ${dest}: ${Object.keys(chapters).length} chapters, ${n} verses`);
  if (warnings.length) {
    console.warn(`${warnings.length} warnings:`);
    for (const w of warnings.slice(0, 20)) console.warn("  " + w);
  }
}
