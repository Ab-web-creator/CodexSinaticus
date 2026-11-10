#!/usr/bin/env node
// Convert a book from the Codex Sinaiticus Project XML (v1.05) into the reader's
// Greek JSON (same token model as build-greek.mjs, see that file).
//
// Usage: node scripts/build-greek-csp.mjs <input.xml> <bookSlug>
//   e.g. node scripts/build-greek-csp.mjs sources/sinaiticus/matthew_CSP.xml matthew
//
// Normalisations: lunate sigma ϲ is written as σ/ς (to match the IGNTP John text);
// margin notes, running titles, line-break hyphens, line-filler marks (>) and
// lacuna gaps are omitted.

import { readFileSync } from "node:fs";
import { TOKEN_RE, attrs, decode, pushSeg, writeGreek } from "./lib/xml.mjs";

const [input, book] = process.argv.slice(2);
if (!input || !book) {
  console.error("Usage: node scripts/build-greek-csp.mjs <input.xml> <bookSlug>");
  process.exit(1);
}

const SKIP = new Set(["margin", "note", "teiHeader"]);
const OVERLINE = new Set(["ol", "ol2", "ul-ol2"]);
const PUNCT_ONLY = /^[·:˙,.;⁘…·]+$/;

/** ϲ -> σ, and ς at the end of a word (ignoring a trailing apostrophe or combining marks). */
function normaliseSigma(word) {
  for (const s of word) s.t = s.t.replace(/ϲ/g, "σ").replace(/Ϲ/g, "Σ");
  for (let i = word.length - 1; i >= 0; i--) {
    const m = /σ([ʼ'̀-ͯ]*)$/.exec(word[i].t);
    if (m) word[i].t = word[i].t.slice(0, m.index) + "ς" + m[1];
    if (/\p{L}/u.test(word[i].t)) break;
  }
}

const chapters = {};
const warnings = [];
let skipDepth = 0;
let folio = null;
let verse = null;
let listStack = [];
let appStack = [];
let word = null;
let fmt = {};
const fmtStack = [];
const target = () => listStack[listStack.length - 1];

for (const m of readFileSync(input, "utf8").matchAll(TOKEN_RE)) {
  const [, closing, name, rawAttrs, selfClosing, text] = m;

  if (text !== undefined) {
    if (skipDepth || !verse) continue;
    // ">" is the scribe's line-filler mark, not part of the text.
    const t = decode(text).replace(/\s+|>/g, "");
    if (!t) continue;
    if (word) pushSeg(word, t, fmt);
    else warnings.push(`Stray text "${t}" in ${verse.ref}`);
    continue;
  }
  if (!name) continue;
  const a = attrs(rawAttrs);

  if (SKIP.has(name)) {
    if (!selfClosing) skipDepth += closing ? -1 : 1;
    continue;
  }
  if (skipDepth) continue;
  if (name === "pb" && a.n) folio = a.n;

  if (name === "ab") {
    if (closing) {
      verse = null;
      continue;
    }
    const vm = /K(\d+)V(\d+)-/.exec(a.id || "");
    if (!vm || vm[1] === "0") continue; // book intro / Eusebian apparatus
    verse = { v: Number(vm[2]), f: folio, t: [], ref: `${vm[1]}:${vm[2]}` };
    (chapters[vm[1]] ??= []).push(verse);
    listStack = [verse.t];
    continue;
  }
  if (!verse) continue;

  if (name === "w" && !selfClosing) {
    if (!closing) word = [];
    else {
      const txt = (word ?? []).map((s) => s.t).join("");
      if (PUNCT_ONLY.test(txt)) target().push({ p: txt });
      else if (txt) {
        normaliseSigma(word);
        target().push({ w: word });
      }
      word = null;
    }
  } else if (name === "hi" && !selfClosing) {
    if (closing) fmt = fmtStack.pop() ?? {};
    else {
      fmtStack.push(fmt);
      fmt = OVERLINE.has(a.rend) ? { ...fmt, o: 1 } : { ...fmt };
    }
  } else if (name === "app") {
    if (closing) appStack.pop();
    else {
      const app = { c: { orig: [], corr: [] } };
      target().push(app);
      appStack.push(app);
    }
  } else if (name === "rdg") {
    const app = appStack[appStack.length - 1];
    if (closing) listStack.pop();
    else if (a.type === "main-corr") listStack.push(app.c.orig);
    else {
      const r = { h: a.n || "corr", t: [] };
      app.c.corr.push(r);
      if (!selfClosing) listStack.push(r.t);
    }
  }
}

for (const list of Object.values(chapters)) for (const v of list) delete v.ref;

writeGreek(
  book,
  "Codex Sinaiticus (GA 01)",
  "Transcription by the Codex Sinaiticus Project (v1.05, 2020), CC BY-NC-SA. Converted to JSON for this reader (first-hand text with corrections marked; lunate sigma normalised to σ/ς).",
  chapters,
  warnings,
);
