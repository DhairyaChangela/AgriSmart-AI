"use client";

import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import type { AnalysisStatus } from "./ResultState";

export interface AnalysisStateProps {
  status: AnalysisStatus;
  /** Submitted photo preview shown while analysing. Optional. */
  imageUrl?: string | null;
  imageAlt?: string;
  /** Extra detail for the failed state (kept technical-free by default). */
  errorMessage?: string;
  onRetry?: () => void;
  onChooseDifferentPhoto?: () => void;
  onCancel?: () => void;
  className?: string;
}

const PHASE_COPY: Record<
  Exclude<AnalysisStatus, "failed">,
  { step: string; title: string; description: string }
> = {
  preparing: {
    step: "Step 1 of 3",
    title: "Getting your photo ready…",
    description: "Looking at your crop…",
  },
  analyzing: {
    step: "Step 2 of 3",
    title: "Examining the visible symptoms…",
    description:
      "Comparing what we can see with known patterns. This usually takes a few seconds.",
  },
  completing: {
    step: "Step 3 of 3",
    title: "Preparing your result…",
    description: "Putting together a clear explanation and next steps.",
  },
};

const PHASE_INDEX: Record<Exclude<AnalysisStatus, "failed">, number> = {
  preparing: 0,
  analyzing: 1,
  completing: 2,
};

/**
 * Polished analysis progress + failure states.
 *
 * Honest by design: language describes what the *screen* is doing
 * ("Looking at your crop…"), never fake internal ML stages or
 * parameter counts.
 */
export function AnalysisState({
  status,
  imageUrl,
  imageAlt = "Photo submitted for analysis",
  errorMessage,
  onRetry,
  onChooseDifferentPhoto,
  onCancel,
  className,
}: AnalysisStateProps) {
  if (status === "failed") {
    return (
      <section
        aria-labelledby="analysis-failed-heading"
        role="alert"
        className={clsx(
          "mx-auto w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm sm:p-8",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error-50 text-error-600"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </span>
        <h2
          id="analysis-failed-heading"
          className="mt-4 text-h3 text-neutral-900"
        >
          We couldn&apos;t finish the analysis.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-body-sm text-neutral-600">
          {errorMessage ??
            "Something went wrong on our side — your photo is fine. Try again with the same photo."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <Button type="button" onClick={onRetry} size="lg">
              Try again
            </Button>
          )}
          {onChooseDifferentPhoto && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onChooseDifferentPhoto}
            >
              Choose a different photo
            </Button>
          )}
        </div>
      </section>
    );
  }

  const phase = PHASE_COPY[status];
  const activeIndex = PHASE_INDEX[status];

  return (
    <section
      aria-labelledby="analysis-heading"
      aria-busy="true"
      aria-live="polite"
      role="status"
      className={clsx(
        "mx-auto w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8",
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        {/* Photo preview with a soft scanning shimmer (decorative). */}
        <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-neutral-100 sm:h-48 sm:w-48">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center text-neutral-300"
            >
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-primary-500/40"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary-400/70 blur-[1px] motion-safe:animate-pulse"
          />
        </div>

        <p className="mt-5 text-caption text-primary-700">{phase.step}</p>
        <h2 id="analysis-heading" className="mt-1 text-h3 text-neutral-900">
          {phase.title}
        </h2>
        <p className="mt-2 max-w-md text-body-sm text-neutral-600">
          {phase.description}
        </p>

        {/* Honest step dots — UI progress, not model internals. */}
        <ol
          aria-label="Analysis progress"
          className="mt-5 flex items-center gap-2"
        >
          {(Object.keys(PHASE_COPY) as Array<Exclude<AnalysisStatus, "failed">>).map(
            (key, i) => (
              <li key={key} aria-current={i === activeIndex ? "step" : undefined}>
                <span
                  className={clsx(
                    "block h-2 rounded-full transition-all duration-300",
                    i < activeIndex && "w-6 bg-primary-400",
                    i === activeIndex && "w-10 bg-primary-600 motion-safe:animate-pulse",
                    i > activeIndex && "w-6 bg-neutral-200"
                  )}
                />
                <span className="sr-only">
                  {PHASE_COPY[key].title}
                  {i === activeIndex ? " (current)" : i < activeIndex ? " (done)" : ""}
                </span>
              </li>
            )
          )}
        </ol>

        {/* Indeterminate progress bar (decorative — screen reader uses live region above). */}
        <div
          aria-hidden="true"
          className="mt-4 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-100"
        >
          <div className="h-full w-1/3 rounded-full bg-primary-500 motion-safe:animate-[analysis-slide_1.4s_ease-in-out_infinite]" />
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          This usually takes a few seconds. Please keep this screen open.
        </p>

        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="mt-2"
          >
            Cancel analysis
          </Button>
        )}
      </div>

      {/* Local keyframes so no global CSS changes are needed. */}
      <style>{`
        @keyframes analysis-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </section>
  );
}
