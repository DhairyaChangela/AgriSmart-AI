"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Recommendation } from "./ResultState";
import { MOCK_DATA_NOTICE } from "./mockResults";

export interface RecommendationCardProps {
  recommendation: Recommendation;
  /** Shown when true: marks content as prototype sample data. */
  isPrototype?: boolean;
  className?: string;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-caption text-neutral-500">{children}</h3>
  );
}

/**
 * Structured agricultural guidance: WHAT TO DO NOW / WHAT TO WATCH / NEXT STEP.
 *
 * Content contract: generic, safe crop-care steps only. Real advice
 * arrives later from the knowledge system — this component just
 * renders whatever `recommendation` it is given.
 */
export function RecommendationCard({
  recommendation,
  isPrototype = true,
  className,
}: RecommendationCardProps) {
  const { whatToDoNow, whatToWatch, nextStep } = recommendation;

  return (
    <section
      aria-labelledby="recommendation-heading"
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6",
        className
      )}
    >
      <h2 id="recommendation-heading" className="text-lg font-semibold text-neutral-900">
        Recommended next actions
      </h2>

      <div className="mt-4 space-y-5">
        {whatToDoNow.length > 0 && (
          <div>
            <SectionLabel>What to do now</SectionLabel>
            <ul role="list" className="mt-2 space-y-2">
              {whatToDoNow.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-primary-50/60 px-3 py-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-body-sm text-neutral-800 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {whatToWatch.length > 0 && (
          <div>
            <SectionLabel>What to watch</SectionLabel>
            <ul role="list" className="mt-2 space-y-2">
              {whatToWatch.map((item) => (
                <li key={item} className="flex items-start gap-2.5 px-1">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </span>
                  <span className="text-body-sm text-neutral-700 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl bg-neutral-900 px-4 py-3.5">
          <SectionLabel>
            <span className="text-neutral-400">Next step</span>
          </SectionLabel>
          <p className="mt-1 text-body-sm font-medium text-white leading-relaxed">
            {nextStep}
          </p>
        </div>
      </div>

      {isPrototype && (
        <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-xs leading-relaxed text-neutral-500">
          {MOCK_DATA_NOTICE} Confirm with a local agronomist before treating
          anything.
        </p>
      )}
    </section>
  );
}
