# Codex Sinaiticus · Arabic

A parallel reader: the Greek text of **Codex Sinaiticus** (left) beside an Arabic
translation (right), verse by verse. For now the Arabic is the public-domain
**Van Dyck** translation; it is meant to be replaced by *True Meaning* (المعنى الصحيح, Al-Kalima).

Built with Next.js (App Router) and Tailwind CSS. Every chapter page is generated
statically at build time.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Data pipeline

Raw sources live in `sources/`. Scripts convert them to JSON in `src/data/`, which
the pages read at build time.

| Text | Raw source | Script | Output |
|---|---|---|---|
| Greek (Sinaiticus) | `sources/sinaiticus/john_GA01_IGNTP.xml` | `npm run build:greek` | `src/data/greek/john.json` |
| Arabic (Van Dyck) | `sources/arabic-van-dyck/JHN.usfm` | `npm run build:arabic` | `src/data/arabic/john.json` |
| Arabic (True Meaning) | `sources/true-meaning/*.txt` | _to be added once the file format is known_ | same file, replacing Van Dyck |

To add a book, generate its JSON files, then add it to `BOOKS` in `src/lib/books.ts`.

### Greek text

The Greek is the IGNTP transcription of John in Codex Sinaiticus (GA 01), from
<https://itseeweb.cal.bham.ac.uk/iohannes/download.html>. The reader shows:

- the **first-hand** text (what the original scribe wrote), unaccented, as in the manuscript;
- **nomina sacra** with their overline (e.g. θ̅ς̅);
- **corrections** as dotted-underlined text; click one to see what later correctors changed;
- verses the manuscript doesn't contain (e.g. 5:4, 7:53–8:11), labelled as absent;
- an αβγ / ΑΒΓ toggle for majuscule display.

IGNTP transcriptions cover John only. The other Gospels would need the Codex Sinaiticus
Project XML (<https://www.codexsinaiticus.org/en/project/transcription_download.aspx>),
licensed CC BY-NC-SA 3.0 (non-commercial, share-alike), which uses a different XML layout
and needs its own import script.

## Credits and licenses

- Greek: transcription by the International Greek New Testament Project (IGNTP),
  University of Birmingham, licensed
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes: converted to JSON;
  margin notes and line breaks omitted.
- Arabic: Smith–Van Dyck translation (1865), public domain, USFM from [eBible.org](https://ebible.org/find/details.php?id=arb-vd).
