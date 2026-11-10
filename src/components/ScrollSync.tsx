"use client";

import { useEffect } from "react";
import { buildAnchors, followerShift, verseTops, type Anchors } from "@/lib/scrollSync";

const READING_LINE = 96; // px from the top of the window where verses are matched
const EASE = 0.14; // fraction of the remaining distance moved per frame (smooth glide)

/**
 * Keeps the two [data-sync-col] columns on the same verse while scrolling (wide screens only):
 * the shorter column glides down so the verse at the reading line matches the taller one.
 */
export default function ScrollSync() {
  useEffect(() => {
    const cols = [...document.querySelectorAll<HTMLElement>("[data-sync-col]")];
    if (cols.length !== 2) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const shift = new Map<HTMLElement, number>(cols.map((c) => [c, 0]));
    let lead = cols[0];
    let follower = cols[1];
    let anchors: Anchors = [];
    let max = 0;
    let target = 0;
    let frame = 0;

    const apply = (col: HTMLElement, y: number) => {
      shift.set(col, y);
      col.style.transform = y ? `translateY(${y}px)` : "";
    };

    const measure = () => {
      if (!wide.matches) return cols.forEach((c) => apply(c, 0));
      [lead, follower] = cols[0].offsetHeight >= cols[1].offsetHeight ? cols : [cols[1], cols[0]];
      apply(lead, 0);
      const top = (c: HTMLElement) => c.getBoundingClientRect().top + window.scrollY - shift.get(c)!;
      const f = { leadTop: top(lead), followerTop: top(follower) };
      const frameBox = { ...f, leadBottom: f.leadTop + lead.offsetHeight, followerBottom: f.followerTop + follower.offsetHeight };
      anchors = buildAnchors(verseTops(lead, 0), verseTops(follower, shift.get(follower)!), frameBox);
      max = Math.max(0, lead.offsetHeight - follower.offsetHeight);
      update();
    };

    const tick = () => {
      const cur = shift.get(follower)!;
      const next = Math.abs(target - cur) < 0.5 ? target : cur + (target - cur) * EASE;
      apply(follower, next);
      frame = next === target ? 0 : requestAnimationFrame(tick);
    };

    const update = () => {
      if (!wide.matches || anchors.length < 2) return;
      target = followerShift(anchors, window.scrollY + READING_LINE, max);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const resize = new ResizeObserver(measure);
    cols.forEach((c) => resize.observe(c));
    const flags = new MutationObserver(measure); // interlinear / translation / letter-style switches
    flags.observe(document.documentElement, { attributes: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    measure();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      flags.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      cols.forEach((c) => (c.style.transform = ""));
    };
  }, []);

  return null;
}
