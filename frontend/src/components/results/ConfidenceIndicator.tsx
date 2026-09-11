"use client";

import { clsx } from "clsx";
import type { ConfidenceLevel } from "./ResultState";
import {
  CONFIDENCE_COPY,
  formatConfidencePercent,
} from "./ResultState";

export interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  /** Raw 0–1 model score. Shown only with a "model confidence" label. */
  score?: number;
  compact?: boolean;
  className?: string;
}

const levelStyles: Record<ConfidenceLevel, { bar: string; chip: string; filled: number }> = {
  high: {
    bar: "bg-success-500",
    chip: "bg-success-50 text-success-700 border border-success-100",
    filled: 3,
  },
  moderate: {
    bar: "bg-warning-500",
    chip: "bg-warning-50 text-warning-700 border border-warning-100",
    filled: 2,
  },
  low: {
    bar: "bg-warning-500",
    chip: "bg-warning-50 text-warning-700 border border-warning-100",
    filled: 1,
  },
};

/**
 * Calm, farmer-friendly confidence display.
 *
 * - Words first ("High confidence"), never a giant percentage.
 * - An optional numeric score is always labelled "model confidence",
 *   never certainty.
 * - Three-segment meter keeps it glanceable without dashboard density.
 */
export function ConfidenceIndicator({
  level,
  score,
  compact = false,
  className,
}: ConfidenceIndicatorProps) {
  const copy = CONFIDENCE_COPY[level];
  const styles = levelStyles[level];
  const hasScore = typeof score === "number" && Number.isFinite(score);

  return (
    <div
      className={clsx("flex items-start gap-3", className)}
      role="meter"
      aria-label={`${copy.label}${hasScore ? `, model confidence ${formatConfidencePercent(score as number)} percent` : ""}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={hasScore ? Math.round((score as number) * 100) : undefined}
      aria-valuetext={copy.label}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold",
              styles.chip
            )}
          >
            {copy.label}
          </span>
          {hasScore && !compact && (
            <span className="text-sm text-neutral-500">
              Model confidence: {formatConfidencePercent(score as number)}%
            </span>
          )}
        </div>

        <div
          className="mt-2 flex items-center gap-1.5"
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={clsx(
                "h-1.5 w-10 rounded-full",
                i < styles.filled ? styles.bar : "bg-neutral-200"
              )}
            />
          ))}
        </div>

        {!compact && (
          <p className="mt-1.5 text-sm leading-snug text-neutral-600">
            {copy.description}{" "}
            {hasScore && (
              <span className="text-neutral-500">
                This number shows how sure the model is — not a guarantee.
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
