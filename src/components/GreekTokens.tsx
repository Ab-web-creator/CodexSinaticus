import { Fragment } from "react";
import type { GreekToken, Seg } from "@/lib/types";
import Correction from "./Correction";

function Word({ segs }: { segs: Seg[] }) {
  return (
    <span className="whitespace-nowrap">
      {segs.map((s, i) =>
        s.o ? (
          <span key={i} className="nomen-sacrum" title="Nomen sacrum (abbreviated sacred name)">
            {s.t}
          </span>
        ) : s.x ? (
          <span key={i} className="text-muted" title="Letters supplied to expand an abbreviation">
            ({s.t})
          </span>
        ) : (
          <Fragment key={i}>{s.t}</Fragment>
        ),
      )}
    </span>
  );
}

/** Renders a token list with spaces between words. Safe in server and client components. */
export default function GreekTokens({ tokens }: { tokens: GreekToken[] }) {
  return (
    <>
      {tokens.map((tok, i) => {
        const sep = i > 0 ? " " : null;
        if ("w" in tok)
          return (
            <Fragment key={i}>
              {sep}
              <Word segs={tok.w} />
            </Fragment>
          );
        if ("p" in tok)
          return (
            <Fragment key={i}>
              {sep}
              <span className="text-accent">{tok.p}</span>
            </Fragment>
          );
        return (
          <Fragment key={i}>
            {sep}
            <Correction orig={tok.c.orig} corr={tok.c.corr} />
          </Fragment>
        );
      })}
    </>
  );
}
