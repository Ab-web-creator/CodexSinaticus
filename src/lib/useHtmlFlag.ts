"use client";

import { useEffect, useState } from "react";

/**
 * A boolean display preference stored as <html data-{name}="true"> and in localStorage,
 * so CSS can react to it and it survives reloads. The layout applies it before first paint.
 */
export function useHtmlFlag(name: string): [boolean, (value: boolean) => void] {
  const [value, setValue] = useState(false);

  useEffect(() => {
    setValue(document.documentElement.dataset[name] === "true");
  }, [name]);

  const set = (next: boolean) => {
    setValue(next);
    document.documentElement.dataset[name] = String(next);
    try {
      localStorage.setItem(name, String(next));
    } catch {}
  };

  return [value, set];
}
