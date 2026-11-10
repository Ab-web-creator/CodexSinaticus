// Scroll synchronisation between the Greek column and the translation column.
// The taller column ("lead") scrolls with the page; the shorter one ("follower") is shifted
// down so that the verse at the reading line is the same verse in both columns.

/** Pairs of page-Y positions (lead, follower) for the same verse, plus column top and bottom. */
export type Anchors = [lead: number, follower: number][];

/** Page-Y of every visible verse marker ([data-v]) in a column, ignoring its current shift. */
export function verseTops(col: HTMLElement, shift: number): Map<number, number> {
  const tops = new Map<number, number>();
  for (const el of col.querySelectorAll<HTMLElement>("[data-v]")) {
    if (!el.offsetParent) continue; // hidden translation
    const v = Number(el.dataset.v);
    if (!tops.has(v)) tops.set(v, el.getBoundingClientRect().top + window.scrollY - shift);
  }
  return tops;
}

/** Matching anchors for verses present in both columns, framed by the column tops and bottoms. */
export function buildAnchors(
  lead: Map<number, number>,
  follower: Map<number, number>,
  frame: { leadTop: number; followerTop: number; leadBottom: number; followerBottom: number },
): Anchors {
  const pairs: Anchors = [[frame.leadTop, frame.followerTop]];
  for (const v of [...lead.keys()].sort((a, b) => a - b)) {
    const f = follower.get(v);
    const l = lead.get(v)!;
    if (f !== undefined && l > pairs[pairs.length - 1][0] && f >= pairs[pairs.length - 1][1]) pairs.push([l, f]);
  }
  pairs.push([frame.leadBottom, frame.followerBottom]);
  return pairs;
}

/** How far the follower must move down so its text at page-Y `line` matches the lead's. */
export function followerShift(anchors: Anchors, line: number, max: number): number {
  let i = 0;
  while (i < anchors.length - 2 && anchors[i + 1][0] <= line) i++;
  const [l0, f0] = anchors[i];
  const [l1, f1] = anchors[i + 1];
  const t = l1 > l0 ? Math.min(1, Math.max(0, (line - l0) / (l1 - l0))) : 0;
  const followerAtLine = f0 + t * (f1 - f0);
  return Math.min(max, Math.max(0, line - followerAtLine));
}
