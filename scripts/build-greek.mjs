#!/usr/bin/env node
// Convert an IGNTP TEI XML transcription of Codex Sinaiticus (GA 01) into
// verse-indexed JSON for the reader.
//
// Usage: node scripts/build-greek.mjs <input.xml> <bookSlug>
//   e.g. node scripts/build-greek.mjs sources/sinaiticus/john_GA01_IGNTP.xml john
//
// Output: src/data/greek/<bookSlug>.json
//
// Token model (kept compact because it ships to the browser):
//   { w: Seg[] }                     a word; Seg = { t, o?:1 (overline), x?:1 (expanded abbreviation) }
//   { p: "·" }                       punctuation as written in the manuscript
//   { c: { orig: Tok[], corr: [{ h: hand, t: Tok[] }] } }   a correction
// The reader displays the first-hand (original scribe) text and marks corrections.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [input, book] = process.argv.slice(2);
if (!input || !book) {
  console.error("Usage: node scripts/build-greek.mjs <input.xml> <bookSlug>");
  process.exit(1);
}

const xml = readFileSync(input, "utf8");

const decode = (s) =>
  s
    .replace(/&om;/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

const attrs = (s) => {
  const out = {};
  for (const m of s.matchAll(/([\w:]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
};

const TOKEN_RE =
  /<!--[\s\S]*?-->|<!DOCTYPE[\s\S]*?\]>|<\?[\s\S]*?\?>|<(\/?)([\w:]+)([^>]*?)(\/?)>|([^<]+)/g;

// Elements whose content is not part of the running biblical text.
const SKIP = new Set(["teiHeader", "note", "fw", "seg"]);

const chapters = {}; // { [chapter]: Verse[] }
let skipDepth = 0;
let folio = null;
let verse = null; // { v, f, t: Tok[] }
let listStack = []; // stack of Tok[] we are appending to
let appStack = []; // open correction objects
let word = null; // Seg[] while inside <w>
let fmt = { o: 0, x: 0 };
let fmtStack = [];
let pc = null;
const warnings = [];

const target = () => listStack[listStack.length - 1];

for (const m of xml.matchAll(TOKEN_RE)) {
  const [, closing, name, rawAttrs, selfClosing, text] = m;

  if (text !== undefined) {
    if (skipDepth || !verse) continue;
    const t = decode(text).replace(/\s+/g, "");
    if (!t) continue;
    if (pc !== null) pc += t;
    else if (word) {
      const seg = { t };
      if (fmt.o) seg.o = 1;
      if (fmt.x) seg.x = 1;
      const last = word[word.length - 1];
      if (last && !!last.o === !!seg.o && !!last.x === !!seg.x) last.t += t;
      else word.push(seg);
    } else warnings.push(`Stray text "${t}" in ${verse.ref}`);
    continue;
  }
  if (!name) continue; // comment / doctype / PI

  const a = rawAttrs ? attrs(rawAttrs) : {};

  if (SKIP.has(name)) {
    if (selfClosing) continue;
    skipDepth += closing ? -1 : 1;
    continue;
  }
  if (skipDepth) continue;

  if (name === "pb" && a.n) {
    folio = a.n;
    continue;
  }

  if (name === "ab") {
    if (closing) {
      verse = null;
      listStack = [];
      continue;
    }
    const vm = /K(\d+)V(\d+)$/.exec(a.n || "");
    if (!vm) continue; // incipit / explicit
    const c = Number(vm[1]);
    const v = Number(vm[2]);
    verse = { v, f: folio, t: [], ref: `${c}:${v}` };
    (chapters[c] ??= []).push(verse);
    listStack = [verse.t];
    continue;
  }

  if (!verse) continue;

  switch (name) {
    case "w":
      if (closing) {
        if (word && word.length) target().push({ w: word });
        word = null;
      } else if (!selfClosing) word = [];
      break;
    case "pc":
      if (closing) {
        if (pc) target().push({ p: pc });
        pc = null;
      } else if (!selfClosing) pc = "";
      break;
    case "hi":
    case "ex":
      if (closing) fmt = fmtStack.pop();
      else if (!selfClosing) {
        fmtStack.push(fmt);
        fmt = { ...fmt };
        if (name === "ex") fmt.x = 1;
        else if (a.rend === "overline") fmt.o = 1;
      }
      break;
    case "app":
      if (closing) {
        appStack.pop();
      } else {
        if (word) warnings.push(`Correction inside a word at ${verse.ref}`);
        const app = { c: { orig: [], corr: [] } };
        target().push(app);
        appStack.push(app);
      }
      break;
    case "rdg": {
      const app = appStack[appStack.length - 1];
      if (closing) {
        listStack.pop();
      } else if (selfClosing) {
        if (a.type === "corr") app.c.corr.push({ h: a.hand, t: [] });
      } else if (a.type === "orig") {
        listStack.push(app.c.orig);
      } else {
        const r = { h: a.hand, t: [] };
        app.c.corr.push(r);
        listStack.push(r.t);
      }
      break;
    }
    default:
      // lb, cb, abbr, unclear, etc. carry no structural meaning for the reader
      break;
  }
}

for (const list of Object.values(chapters)) for (const v of list) delete v.ref;

const out = {
  book,
  witness: "Codex Sinaiticus (GA 01)",
  source:
    "Transcription by the International Greek New Testament Project (IGNTP), University of Birmingham. CC BY 4.0. Converted to JSON for this reader (first-hand text with corrections marked).",
  chapters,
};

const dest = `src/data/greek/${book}.json`;
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(out));

const nVerses = Object.values(chapters).reduce((n, l) => n + l.length, 0);
console.log(`Wrote ${dest}: ${Object.keys(chapters).length} chapters, ${nVerses} verses`);
if (warnings.length) {
  console.warn(`${warnings.length} warnings:`);
  for (const w of warnings.slice(0, 20)) console.warn("  " + w);
}
