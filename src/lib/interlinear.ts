import type { GreekToken, InterlinearEntry } from "./types";

/** Gloss language shown under the Greek. More languages can be added to the data later. */
export const GLOSS_LANG = "en";

/**
 * Returns a copy of the tokens with each first-hand word carrying its interlinear entry.
 * Walks words in the same order the build script counted them (corrections: first-hand reading).
 */
export function attachInterlinear(tokens: GreekToken[], entries: (InterlinearEntry | 0)[] | undefined): GreekToken[] {
  if (!entries) return tokens;
  let i = 0;
  const walk = (list: GreekToken[]): GreekToken[] =>
    list.map((t) => {
      if ("w" in t) return { ...t, il: entries[i++] ?? 0 };
      if ("c" in t) return { c: { orig: walk(t.c.orig), corr: t.c.corr } };
      return t;
    });
  return walk(tokens);
}
