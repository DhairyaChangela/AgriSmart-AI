"use client";

import { clsx } from "clsx";

export interface RecommendationCardProps {
  title?: string;
  items: string[];
  className?: string;
}

/** Primary practical guidance — strongest visual weight on the results screen. */
export function RecommendationCard({ title = "What to do now", items, className }: RecommendationCardProps) {
  return (
    <section
      className={clsx("rounded-2xl border border-primary-200 bg-primary-50/80 px-4 py-4 sm:px-5 sm:py-5", className)}
      aria-labelledby="recommendation-heading"
    >
      <h2 id="recommendation-heading" className="text-base font-bold text-primary-950 sm:text-lg">
        {title}
      </h2>
      <ol className="mt-3 space-y-3" role="list">
        {items.map((item, i) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-primary-950/95 sm:text-base">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-700 text-xs font-bold text-white">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}
