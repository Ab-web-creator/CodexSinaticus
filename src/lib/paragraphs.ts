import type { ArabicBook } from "./types";

export type Block = { heading?: string; verses: number[] };

/**
 * Groups a chapter's verses into paragraphs, following the Arabic edition's
 * paragraph breaks. A section heading always opens a new paragraph.
 */
export function buildBlocks(arabic: ArabicBook, chapter: string, extraVerses: number[] = []): Block[] {
  const headings = arabic.headings?.[chapter] ?? {};
  const paraStarts = new Set(arabic.paragraphs?.[chapter] ?? []);
  const nums = [
    ...new Set([...Object.keys(arabic.chapters[chapter] ?? {}).map(Number), ...extraVerses]),
  ].sort((a, b) => a - b);

  const blocks: Block[] = [];
  for (const n of nums) {
    const heading = headings[String(n)];
    if (!blocks.length || heading || paraStarts.has(n)) blocks.push({ heading, verses: [] });
    blocks[blocks.length - 1].verses.push(n);
  }
  return blocks;
}
