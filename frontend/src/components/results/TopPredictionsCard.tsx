"use client";

import { clsx } from "clsx";
import type { TopPrediction } from "./ResultState";
import { formatConfidencePercent } from "./ResultState";

export interface TopPredictionsCardProps {
  /** Ranked alternatives the model considered, in confidence order. */
  predictions: TopPrediction[];
  /** Renders an "uncertain" framing instead of the default one. */
  uncertain?: boolean;
  className?: string;
}

/**
 * Data-driven "Other possible matches" list. Only ever renders what the
 * backend sent — the UI never invents candidates or percentages. Every
 * number is explicitly labelled "model confidence".
 */
export function TopPredictionsCard({
  predictions,
  uncertain = false,
  className,
}: TopPredictionsCardProps) {
  if (predictions.length === 0) return null;

  const max = Math.max(...predictions.map((p) => p.confidence), 0);

  return (
    <section
      aria-labelledby="top-predictions-heading"
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6",
        className
      )}
    >
      <h2
        id="top-predictions-heading"
        className="text-caption text-neutral-500"
      >
        Other possible matches
      </h2>
      <p className="mt-2 text-body text-neutral-800 leading-relaxed">
        {uncertain
          ? "The model could not confidently separate these candidates for your photo."
          : "These are alternatives the model considered — not a second diagnosis."}
      </p>

      <ol role="list" className="mt-4 space-y-3">
        {predictions.map((prediction, i) => (
          <li key={`${prediction.label}-${i}`} className="rounded-xl bg-neutral-50 px-3.5 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-semibold text-neutral-900">
                <span className="mr-2 text-xs text-neutral-400">
                  #{i + 1}
                </span>
                {prediction.label}
              </span>
              <span className="text-xs text-neutral-500">
                Model confidence: {formatConfidencePercent(prediction.confidence)}%
              </span>
            </div>
            <div
              aria-hidden="true"
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200"
            >
              <div
                className={clsx(
                  "h-full rounded-full",
                  uncertain ? "bg-warning-500" : "bg-primary-500"
                )}
                style={{
                  width: `${Math.max(2, (prediction.confidence / max) * 100)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-xs leading-relaxed text-neutral-500">
        These percentages show how strongly the model ranked each match — not
        how sure anyone is that a condition is present.
      </p>
    </section>
  );
}