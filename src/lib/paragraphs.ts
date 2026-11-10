import type { TranslationBook } from "./types";

export type Block = { heading?: string; verses: number[] };

/**
 * Groups a chapter's verses into paragraphs, following the translation's
 * paragraph breaks (plus any `extraBreaks`, e.g. shared with the Greek). A section heading
 * always opens a new paragraph.
 */
export function buildBlocks(
  text: TranslationBook,
  chapter: string,
  extraVerses: number[] = [],
  extraBreaks: number[] = [],
): Block[] {
  const headings = text.headings?.[chapter] ?? {};
  const paraStarts = new Set([...(text.paragraphs?.[chapter] ?? []), ...extraBreaks]);
  const nums = [
    ...new Set([...Object.keys(text.chapters[chapter] ?? {}).map(Number), ...extraVerses]),
  ].sort((a, b) => a - b);

  const blocks: Block[] = [];
  for (const n of nums) {
    const heading = headings[String(n)];
    if (!blocks.length || heading || paraStarts.has(n)) blocks.push({ heading, verses: [] });
    blocks[blocks.length - 1].verses.push(n);
  }
  return blocks;
}
