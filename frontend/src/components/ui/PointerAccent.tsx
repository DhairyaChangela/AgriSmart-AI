"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

function subscribePointerAccent(onStoreChange: () => void) {
  const queries = [
    window.matchMedia("(pointer: coarse)"),
    window.matchMedia("(hover: none)"),
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  ];
  queries.forEach((mq) => mq.addEventListener("change", onStoreChange));
  return () => queries.forEach((mq) => mq.removeEventListener("change", onStoreChange));
}

function getPointerAccentSnapshot() {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !(coarse || noHover || reduced);
}

function getPointerAccentServerSnapshot() {
  return false;
}

/**
 * Quiet pointer accent for fine pointers only. Does not replace the native cursor
 * on text inputs or obscure interactive regions.
 */
export function PointerAccent() {
  const enabled = useSyncExternalStore(subscribePointerAccent, getPointerAccentSnapshot, getPointerAccentServerSnapshot);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const interactive = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      interactive.current = Boolean(
        el?.closest("a, button, [role='button'], input, textarea, select, label, summary, [data-pointer-accent]")
      );
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.22;
      current.current.y += (target.current.y - current.current.y) * 0.22;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) scale(${interactive.current ? 1.35 : 1})`;
      }
      if (ring) {
        ring.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) scale(${interactive.current ? 1.6 : 1})`;
        ring.style.opacity = interactive.current ? "0.35" : "0.2";
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[400]" aria-hidden="true">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-7 w-7 rounded-full border border-primary-500/30 will-change-transform"
        style={{ opacity: 0.2 }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-primary-600/70 will-change-transform"
      />
    </div>
  );
}
