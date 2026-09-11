"use client";

import { clsx } from "clsx";
import type { AnalysisPhase } from "./types";

export interface AnalysisStateProps {
  phase: AnalysisPhase;
  className?: string;
}

export function AnalysisState({ phase, className }: AnalysisStateProps) {
  if (phase === "idle" || phase === "complete") return null;

  const isError = phase === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "rounded-xl border px-4 py-4",
        isError ? "border-error-200 bg-error-50 text-error-900" : "border-primary-200 bg-primary-50 text-primary-900",
        className
      )}
    >
      {isError ? (
        <>
          <p className="font-semibold">Analysis could not finish</p>
          <p className="mt-1 text-sm leading-relaxed">Try again in a moment, or return to capture with a new photo.</p>
        </>
      ) : (
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-primary-700" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div>
            <p className="font-semibold">Reviewing your photo…</p>
            <p className="mt-1 text-sm leading-relaxed text-primary-800/90">
              Sample UI state — no live model is running in this prototype build.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
