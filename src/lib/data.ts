import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Lang } from "./translations";
import type { GreekBook, InterlinearBook, TranslationBook } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function readJson<T>(file: string): T | null {
  const full = path.join(DATA_DIR, file);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8")) as T;
}

export const loadGreek = (book: string) => readJson<GreekBook>(`greek/${book}.json`);
export const loadTranslation = (lang: Lang, book: string) =>
  readJson<TranslationBook>(`translation/${lang}/${book}.json`);
export const loadInterlinear = (book: string) => readJson<InterlinearBook>(`interlinear/${book}.json`);
