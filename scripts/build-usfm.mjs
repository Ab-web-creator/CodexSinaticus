#!/usr/bin/env node
// Convert a USFM book file into the reader's translation JSON format.
//
// Usage: node scripts/build-usfm.mjs <input.usfm> <lang> <bookSlug> <name> <source>
//   lang: language code of the translation, e.g. "ar" or "nl"
// Output: src/data/translation/<lang>/<bookSlug>.json
//
// Handles \c, \v, \s1..\s3 (section headings, attached to the next verse) and
// strips inline character markers such as \add ...\add* and footnotes \f ...\f*.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const [input, lang, book, name, source] = process.argv.slice(2);
if (!input || !lang || !book || !name || !source) {
  console.error("Usage: node scripts/build-usfm.mjs <input.usfm> <lang> <bookSlug> <name> <source>");
  process.exit(1);
}

const usfm = readFileSync(input, "utf8").replace(/^﻿/, "");

const clean = (s) =>
  s
    .replace(/\\f\s[\s\S]*?\\f\*/g, "") // footnotes
    .replace(/\\x\s[\s\S]*?\\x\*/g, "") // cross references
    .replace(/\\\+?[a-z0-9]+\*?/gi, "") // remaining inline markers
    .replace(/\s+/g, " ")
    .trim();

const chapters = {};
const headings = {};
const paragraphs = {}; // chapter -> verse numbers that begin a new paragraph
let chapter = null;
let newPara = false;
let verse = null;
let pendingHeading = null;

// Split into marker-led chunks: "\v 1 text...", "\s1 heading", "\p", ...
for (const chunk of usfm.split(/(?=^\\)/m)) {
  const m = /^\\(\w+)\s*([\s\S]*)$/.exec(chunk.trim());
  if (!m) continue;
  const [, marker, rest] = m;

  if (marker === "c") {
    chapter = rest.trim().split(/\s/)[0];
    verse = null;
    chapters[chapter] ??= {};
    newPara = true;
  } else if (marker === "v" && chapter) {
    const vm = /^(\d+)(?:-\d+)?\s*([\s\S]*)$/.exec(rest);
    if (!vm) continue;
    verse = vm[1];
    chapters[chapter][verse] = clean(vm[2]);
    if (newPara) {
      (paragraphs[chapter] ??= []).push(Number(verse));
      newPara = false;
    }
    if (pendingHeading) {
      (headings[chapter] ??= {})[verse] = pendingHeading;
      pendingHeading = null;
    }
  } else if (/^s\d?$/.test(marker) && chapter) {
    pendingHeading = clean(rest);
    newPara = true;
  } else if (/^(p|m|q\d?|pi\d?|li\d?)$/.test(marker) && chapter) {
    if (verse && rest.trim()) {
      // paragraph marker followed by continuation text of the current verse
      chapters[chapter][verse] += " " + clean(rest);
    } else newPara = true;
  }
}

const dir = `src/data/translation/${lang}`;
mkdirSync(dir, { recursive: true });
const dest = `${dir}/${book}.json`;
writeFileSync(dest, JSON.stringify({ book, name, source, chapters, headings, paragraphs }));

const n = Object.values(chapters).reduce((a, c) => a + Object.keys(c).length, 0);
console.log(`Wrote ${dest}: ${Object.keys(chapters).length} chapters, ${n} verses`);
