# Codex Sinaiticus · Arabic

A parallel reader: the Greek text of **Codex Sinaiticus** (left) beside a translation
(right). The right page shows **Dutch** (NBG 1951) by default or **Arabic** (Van Dyck, to be
replaced by *True Meaning* / المعنى الصحيح, Al-Kalima); the reader's choice is remembered.

Built with Next.js (App Router) and Tailwind CSS. Every chapter page is generated
statically at build time.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Data pipeline

Raw sources live in `sources/`. `npm run build:data` (see `scripts/build-all.mjs`)
converts them to JSON in `src/data/`, which the pages read at build time.

| Book | Greek source | Translations (USFM → `build-usfm.mjs`) |
|---|---|---|
| Matthew | `sources/sinaiticus/matthew_CSP.xml` → `build-greek-csp.mjs` | `sources/arabic-van-dyck/MAT.usfm`, `sources/dutch-nbg1951/MAT.usfm` |
| Mark | `sources/sinaiticus/mark_CSP.xml` → `build-greek-csp.mjs` | `sources/arabic-van-dyck/MRK.usfm`, `sources/dutch-nbg1951/MRK.usfm` |
| John | `sources/sinaiticus/john_GA01_IGNTP.xml` → `build-greek.mjs` | `sources/arabic-van-dyck/JHN.usfm`, `sources/dutch-nbg1951/JHN.usfm` |

Translations are written to `src/data/translation/{lang}/{book}.json`. To add one, add it to
`TRANSLATIONS` in `scripts/build-all.mjs` and to `LANGS`/`LANG_STYLE` in `src/lib/translations.ts`.

`npm run build:data` also builds the interlinear (`scripts/build-interlinear.mjs`, see below).

To add a book: add its source files, add a line to `scripts/build-all.mjs`, run
`npm run build:data`, then add the book to `BOOKS` in `src/lib/books.ts`.
Navigation (menus, previous/next across books) picks it up automatically.

### Greek text

- **John:** IGNTP transcription of Codex Sinaiticus (GA 01),
  <https://itseeweb.cal.bham.ac.uk/iohannes/download.html>.
- **Matthew, Mark:** Codex Sinaiticus Project transcription v1.05 (2020),
  <https://epapers.bham.ac.uk/3306/>. Only these two books are extracted into `sources/`.
  Lunate sigma (ϲ) is normalised to σ/ς to match John; the scribe's line-filler marks
  are dropped.

The reader shows:

- the **first-hand** text (what the original scribe wrote), unaccented, as in the manuscript;
- **nomina sacra** with their overline (e.g. θ̅ς̅);
- **corrections** as dotted-underlined text; click one to see what later correctors changed;
- verses the manuscript doesn't contain (e.g. Mark 16:9–20, John 7:53–8:11), labelled as absent;
- an αβγ / ΑΒΓ toggle for majuscule display.

### Interlinear (Greek → English)

`scripts/build-interlinear.mjs` aligns every first-hand Sinaiticus word with the words of
TAGNT (`sources/tagnt/*.tsv`, STEPBible) for the same verse: spellings are reduced to a
rough phonetic skeleton (no accents, itacism collapsed, nomina sacra matched by first/last
letter), an order-preserving alignment pairs the words, a second pass catches word-order
differences, and remaining Sinaiticus-only readings are looked up by spelling elsewhere in
the Gospels (marked approximate, shown faded). About 98% of words align directly; ~0.3%
have no gloss.

Output: `src/data/interlinear/{book}.json`, one entry per first-hand word with Strong's
number, morphology code, lemma and glosses keyed by language (`g: { en: "…" }`). To add
another gloss language later, add its key to `g` (e.g. from a Strong's-keyed lexicon) and
switch `GLOSS_LANG` in `src/lib/interlinear.ts` (or add a language picker).

In the reader the gloss is shown under each word by default (the **Interlinear** button
turns it off, and that choice is remembered); hovering a word
shows its dictionary form, Strong's number and parsing in plain English.

## Pages

- `/` – all books; `/{book}/{chapter}` – Greek and Arabic side by side
- `/ar` – Arabic home; `/ar/{book}/{chapter}` – Arabic only, laid out like a printed book
- `/{book}` and `/ar/{book}` redirect to chapter 1

## Credits and licenses

- Greek: transcription by the International Greek New Testament Project (IGNTP),
  University of Birmingham, licensed
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes: converted to JSON;
  margin notes and line breaks omitted.
- Greek (Matthew, Mark): transcription by the Codex Sinaiticus Project (D.C. Parker,
  A. Myshrall, T.A.E. Brown, R. Kevern, H.A.G. Houghton et al.), v1.05, licensed
  [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/3.0/): non-commercial use
  only, and derived data must use the same license. Changes: converted to JSON as above.
- Interlinear: lemmas, morphology and English glosses from TAGNT (Translators Amalgamated
  Greek NT), STEPBible.org / Tyndale House, licensed
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes: aligned automatically
  to the Sinaiticus text.
- Dutch: NBG-vertaling 1951; digital text © 2024 Jantinus Daling, released under the
  [GNU Free Documentation License 1.3](https://www.gnu.org/licenses/fdl-1.3.html), USFM from
  [eBible.org](https://ebible.org/find/details.php?id=nldnbg). Changes: converted to JSON.
- Arabic: Smith–Van Dyck translation (1865), public domain, USFM from [eBible.org](https://ebible.org/find/details.php?id=arb-vd).
