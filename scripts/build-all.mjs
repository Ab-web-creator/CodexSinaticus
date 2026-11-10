#!/usr/bin/env node
// Regenerates all JSON in src/data from the files in sources/.
// To add a book: put its sources in place, add a line to BOOKS, run `npm run build:data`,
// then add it to BOOKS in src/lib/books.ts.
// To add a translation: add it to TRANSLATIONS here and in src/lib/translations.ts.
import { execFileSync } from "node:child_process";

const TRANSLATIONS = [
  {
    lang: "ar",
    dir: "sources/arabic-van-dyck",
    name: "ترجمة فان دايك",
    source: "Arabic Van Dyck (Smith–Van Dyck) translation, 1865. Public domain. Text from eBible.org.",
  },
  {
    lang: "nl",
    dir: "sources/dutch-nbg1951",
    name: "NBG-vertaling 1951",
    source:
      "NBG-vertaling 1951. Digital text © 2024 Jantinus Daling, released under the GNU Free Documentation License 1.3 (https://www.gnu.org/licenses/fdl-1.3.html). Text from eBible.org.",
  },
];

const BOOKS = [
  { slug: "matthew", code: "MAT", greek: ["build-greek-csp.mjs", "sources/sinaiticus/matthew_CSP.xml"] },
  { slug: "mark", code: "MRK", greek: ["build-greek-csp.mjs", "sources/sinaiticus/mark_CSP.xml"] },
  { slug: "john", code: "JHN", greek: ["build-greek.mjs", "sources/sinaiticus/john_GA01_IGNTP.xml"] },
];

const run = (script, ...args) =>
  execFileSync("node", [`scripts/${script}`, ...args], { stdio: "inherit" });

for (const b of BOOKS) {
  run(b.greek[0], b.greek[1], b.slug);
  for (const t of TRANSLATIONS)
    run("build-usfm.mjs", `${t.dir}/${b.code}.usfm`, t.lang, b.slug, t.name, t.source);
  run("build-interlinear.mjs", b.slug, b.code); // needs the Greek JSON from above
}
