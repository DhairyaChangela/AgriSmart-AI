"use client";

import { clsx } from "clsx";

const TIPS = [
  { short: "One leaf", detail: "Fill the frame with a single leaf." },
  { short: "Affected area", detail: "Include spots, edges, or yellowing." },
  { short: "Hold steady", detail: "Use both hands; wait until the view is still." },
  { short: "Even light", detail: "Soft daylight beats harsh shadow or sun." },
  { short: "Sharp photo", detail: "Check focus on your screen before capturing." },
  { short: "Problem visible", detail: "Show the worst area, not only healthy tissue." },
] as const;

export interface ImageGuidanceProps {
  /** Inline chips for camera/choose; panel expands tips on demand */
  variant?: "inline" | "panel";
  className?: string;
}

/**
 * Static photo tips — not live ML. Farmers compare their photo to these cues.
 */
export function ImageGuidance({ variant = "panel", className }: ImageGuidanceProps) {
  if (variant === "inline") {
    return (
      <div className={clsx("space-y-2", className)} aria-labelledby="photo-tips-inline">
        <p id="photo-tips-inline" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Photo tips (for you — not an automatic check)
        </p>
        <ul className="flex flex-wrap gap-2" role="list">
          {TIPS.map((tip) => (
            <li key={tip.short}>
              <span
                title={tip.detail}
                className="inline-flex min-h-9 items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 text-xs font-medium text-neutral-700"
              >
                {tip.short}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <details className={clsx("group rounded-xl border border-neutral-200 bg-white", className)}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-neutral-900 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-xl">
        How to take a useful leaf photo
        <svg
          className="h-4 w-4 shrink-0 text-neutral-500 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="border-t border-neutral-100 px-4 pb-4 pt-3">
        <dl className="grid gap-2 sm:grid-cols-2">
          {TIPS.map((tip) => (
            <div key={tip.short} className="rounded-lg bg-neutral-50 px-3 py-2">
              <dt className="text-xs font-bold text-primary-800">{tip.short}</dt>
              <dd className="mt-0.5 text-xs leading-snug text-neutral-600">{tip.detail}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
          These tips help you judge your own photo. This app does not automatically score blur, lighting, or leaf quality.
        </p>
      </div>
    </details>
  );
}
