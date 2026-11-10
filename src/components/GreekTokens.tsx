import { Fragment } from "react";
import type { GreekToken } from "@/lib/types";
import Correction from "./Correction";
import GreekWord from "./GreekWord";

/** Renders a token list with spaces between words. Safe in server and client components. */
export default function GreekTokens({ tokens }: { tokens: GreekToken[] }) {
  return tokens.map((tok, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      {"w" in tok ? (
        <GreekWord segs={tok.w} il={tok.il} />
      ) : "p" in tok ? (
        <span className="text-accent">{tok.p}</span>
      ) : (
        <Correction orig={tok.c.orig} corr={tok.c.corr} />
      )}
    </Fragment>
  ));
}
