"use client";

import { clsx } from "clsx";

const TIPS = [
  {
    title: "Move closer to the leaf",
    description: "Fill the frame with one leaf, including the affected area.",
  },
  {
    title: "Keep the leaf centered",
    description: "Place the damaged spot inside the frame outline.",
  },
  {
    title: "Hold steady",
    description: "Hold your phone with both hands and wait a moment before capturing.",
  },
  {
    title: "Find soft, even light",
    description: "Avoid deep shadow and harsh direct sun on the leaf.",
  },
  {
    title: "Avoid blur",
    description: "Wait until the leaf looks sharp on your screen, not shaky.",
  },
  {
    title: "Show the problem area",
    description: "Include spots, edges, or discoloration — not just healthy leaves.",
  },
] as const;

function TipIcon({ index }: { index: number }) {
  const paths = [
    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
    "M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4",
    "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  ];
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[index % paths.length]} />
    </svg>
  );
}

export interface ImageGuidanceProps {
  compact?: boolean;
  className?: string;
}

/**
 * Static photo tips for farmers. Not a live camera analysis —
 * the disclaimer below keeps guidance visually distinct from AI validation.
 */
export function ImageGuidance({ compact = false, className }: ImageGuidanceProps) {
  return (
    <section
      aria-labelledby="photo-tips-heading"
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white",
        compact ? "p-4" : "p-5 sm:p-6",
        className
      )}
    >
      <h2
        id="photo-tips-heading"
        className={clsx("font-semibold text-neutral-900", compact ? "text-base" : "text-lg")}
      >
        How to take a good leaf photo
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        Three quick checks before you capture — no technical knowledge needed.
      </p>

      <ul role="list" className={clsx("grid gap-3", compact ? "mt-3" : "mt-4 sm:grid-cols-2")}>
        {TIPS.map((tip, i) => (
          <li
            key={tip.title}
            className="flex items-start gap-3 rounded-xl bg-neutral-50 px-3 py-3"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
            >
              <TipIcon index={i} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">{tip.title}</span>
              <span className="mt-0.5 block text-sm leading-snug text-neutral-600">
                {tip.description}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-xs leading-relaxed text-neutral-500">
        These are simple photo tips to help you. This app does not automatically judge your
        camera view — please compare your photo with the tips above.
      </p>
    </section>
  );
}
