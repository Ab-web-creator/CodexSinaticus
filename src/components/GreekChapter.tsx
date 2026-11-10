import { Fragment } from "react";
import type { Block } from "@/lib/paragraphs";
import { attachInterlinear } from "@/lib/interlinear";
import type { GreekBook, GreekVerse, InterlinearBook } from "@/lib/types";
import GreekTokens from "./GreekTokens";

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

const present = (n: number, byNum: Map<number, GreekVerse>) => !!byNum.get(n)?.t.length;

/** Folds paragraphs made only of missing verses into the previous paragraph, so e.g. Mark 16:9–20 is one note. */
function mergeAbsent(blocks: Block[], byNum: Map<number, GreekVerse>): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    const prev = out[out.length - 1];
    const allAbsent = b.verses.every((n) => !present(n, byNum));
    if (prev && allAbsent && !present(prev.verses[prev.verses.length - 1], byNum))
      out[out.length - 1] = { ...prev, verses: [...prev.verses, ...b.verses] };
    else out.push(b);
  }
  return out;
}

/** The Greek chapter of Codex Sinaiticus as a page. */
export default function GreekChapter({
  greek,
  chapter,
  blocks,
  interlinear,
}: {
  greek: GreekBook;
  interlinear?: InterlinearBook | null;
  chapter: number;
  blocks: Block[];
}) {
  const glosses = interlinear?.chapters[String(chapter)] ?? {};
  const verses = greek.chapters[String(chapter)] ?? [];
  const byNum = new Map(verses.map((v) => [v.v, v]));

  return (
    <div lang="grc" className="greek" data-sync-col>
      {mergeAbsent(blocks, byNum).map((b, i) => (
        <p key={b.verses[0]} id={`gr-v${b.verses[0]}`} className={`greek-para scroll-mt-24 ${i > 0 ? "mt-4" : ""}`}>
          {items(b.verses, byNum).map((it, j) => (
            <Fragment key={j}>
              {j > 0 && " "}
              {it.kind === "verse" ? (
                <span data-v={it.v.v}>
                  <sup className="me-1 font-sans text-[0.55em] font-semibold text-accent">{it.v.v}</sup>
                  <GreekTokens tokens={attachInterlinear(it.v.t, glosses[String(it.v.v)])} />
                </span>
              ) : (
                <span data-v={it.from} className="font-sans text-sm text-muted italic">
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
