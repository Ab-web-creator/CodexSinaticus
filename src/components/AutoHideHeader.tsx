"use client";

import { useEffect, useState } from "react";

const HIDE_AFTER = 300; // px of scrolling before the bar may slide away
const JITTER = 4; // ignore tiny scroll movements

/**
 * Top bar that stays visible for the first 300px, slides up when scrolling down past that,
 * and slides back in as soon as the reader scrolls up.
 */
export default function AutoHideHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= HIDE_AFTER) setHidden(false);
      else if (y > lastY + JITTER) setHidden(true);
      else if (y < lastY - JITTER) setHidden(false);
      if (Math.abs(y - lastY) > JITTER) lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : ""} ${className}`}
    >
      {children}
    </header>
  );
}
