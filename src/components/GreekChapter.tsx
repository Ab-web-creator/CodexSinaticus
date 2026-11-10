import { Fragment } from "react";
import { greekNumeral } from "@/lib/arabic";
import type { Block } from "@/lib/paragraphs";
import type { GreekBook, GreekVerse } from "@/lib/types";
import GreekTokens from "./GreekTokens";
import Ornament from "./Ornament";

type Item = { kind: "verse"; v: GreekVerse } | { kind: "absent"; from: number; to: number };

/** Turns a paragraph's verses into items, merging runs of verses the manuscript lacks. */
function items(nums: number[], byNum: Map<number, GreekVerse>): Item[] {
  const out: Item[] = [];
  for (const n of nums) {
    const v = byNum.get(n);
    if (v && v.t.length) out.push({ kind: "verse", v });
    else {
      const last = out[out.length - 1];
      if (last?.kind === "absent" && last.to === n - 1) last.to = n;
      else out.push({ kind: "absent", from: n, to: n });
    }
  }
  return out;
}

/** The Greek chapter of Codex Sinaiticus as a page. */
export default function GreekChapter({
  greek,
  bookTitle,
  chapter,
  blocks,
}: {
  greek: GreekBook;
  bookTitle: string;
  chapter: number;
  blocks: Block[];
}) {
  const verses = greek.chapters[String(chapter)] ?? [];
  const byNum = new Map(verses.map((v) => [v.v, v]));

  return (
    <div lang="grc" className="greek">
      <p className="text-center text-lg tracking-[0.2em] text-muted">{bookTitle}</p>
      <Ornament className="mx-auto mt-4 mb-5 w-40" />
      <h1 className="text-center text-4xl text-accent">{greekNumeral(chapter)}</h1>
      <Ornament className="mx-auto mt-5 mb-10 w-40" />

      {blocks.map((b, i) => (
        <p key={b.verses[0]} id={`gr-v${b.verses[0]}`} className={`scroll-mt-24 text-[1.3rem] leading-[1.9] ${i > 0 ? "mt-4" : ""}`}>
          {items(b.verses, byNum).map((it, j) => (
            <Fragment key={j}>
              {j > 0 && " "}
              {it.kind === "verse" ? (
                <span>
                  <sup className="me-1 font-sans text-[0.55em] font-semibold text-accent">{it.v.v}</sup>
                  <GreekTokens tokens={it.v.t} />
                </span>
              ) : (
                <span className="font-sans text-sm text-muted italic">
                  [{chapter}:{it.from}
                  {it.to > it.from ? `–${it.to}` : ""} not in Codex Sinaiticus]
                </span>
              )}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
