import { Fragment } from "react";
import { GLOSS_LANG } from "@/lib/interlinear";
import { describeMorph } from "@/lib/morph";
import type { InterlinearEntry, Seg } from "@/lib/types";

function Letters({ segs }: { segs: Seg[] }) {
  return segs.map((s, i) =>
    s.o ? (
      <span key={i} className="nomen-sacrum">{s.t}</span>
    ) : s.x ? (
      <span key={i} className="text-muted">({s.t})</span>
    ) : (
      <Fragment key={i}>{s.t}</Fragment>
    ),
  );
}

const tooltip = (e: InterlinearEntry) =>
  [`${e.l} (${e.s.replace(/^G0*/, "G")})`, describeMorph(e.m), e.a && "approximate: reading not in the tagged text"]
    .filter(Boolean)
    .join("\n");

/**
 * One Greek word. In interlinear mode (default; off with html[data-plain]) it becomes a small stack
 * with the gloss under the word; otherwise the gloss stays hidden.
 */
export default function GreekWord({ segs, il }: { segs: Seg[]; il?: InterlinearEntry | 0 }) {
  const gloss = il ? il.g[GLOSS_LANG] : "";
  return (
    <span className="il-word" title={il ? tooltip(il) : undefined}>
      <span className="whitespace-nowrap">
        <Letters segs={segs} />
      </span>
      <span className={`il-gloss ${il && il.a ? "il-approx" : ""}`} aria-hidden={!gloss}>
        {gloss ? gloss.replace(/[<>]/g, "") : "–"}
      </span>
    </span>
  );
}
