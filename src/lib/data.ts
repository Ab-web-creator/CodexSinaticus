import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { ArabicBook, GreekBook } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function readJson<T>(file: string): T | null {
  const full = path.join(DATA_DIR, file);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8")) as T;
}

export const loadGreek = (book: string) => readJson<GreekBook>(`greek/${book}.json`);
export const loadArabic = (book: string) => readJson<ArabicBook>(`arabic/${book}.json`);
