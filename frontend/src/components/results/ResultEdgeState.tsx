"use client";

import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import type { EdgeKind } from "./ResultState";
import { RESULT_EDGE_COPY } from "./ResultState";

export interface ResultEdgeStateProps {
  kind: EdgeKind;
  /** Optional backend-provided reason (e.g. a validation message). */
  message?: string;
  /** Submitted photo, kept visible so the farmer has context. */
  imageUrl?: string | null;
  imageAlt?: string;
  onRetry?: () => void;
  onRetake?: () => void;
  onCheckAnother?: () => void;
  className?: string;
}

const toneStyles: Record<string, { panel: string; icon: string }> = {
  neutral: {
    panel: "border-neutral-200 bg-white",
    icon: "bg-neutral-100 text-neutral-600",
  },
  info: {
    panel: "border-info-100 bg-white",
    icon: "bg-info-50 text-info-600",
  },
  warning: {
    panel: "border-warning-100 bg-white",
    icon: "bg-warning-50 text-warning-600",
  },
  error: {
    panel: "border-error-100 bg-white",
    icon: "bg-error-50 text-error-600",
  },
};

function EdgeIcon({ kind }: { kind: EdgeKind }) {
  const common = "h-7 w-7";
  if (kind === "failed" || kind === "model-unavailable") {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  if (kind === "rejected") {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.5 5.5l13 13" />
      </svg>
    );
  }
  if (kind === "unknown" || kind === "unsupported-crop") {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

/**
 * Every non-result outcome: unknown, unsupported crop, unassessable,
 * poor image, model unavailable, and hard failure.
 *
 * Each state answers "what happened?" and "what do I do next?" —
 * never a dead end, never fear-based.
 */
export function ResultEdgeState({
  kind,
  message,
  imageUrl,
  imageAlt = "Photo submitted for analysis",
  onRetry,
  onRetake,
  onCheckAnother,
  className,
}: ResultEdgeStateProps) {
  const copy = RESULT_EDGE_COPY[kind];
  const tone = toneStyles[copy.tone] ?? toneStyles.neutral;
  const isAlert = kind === "failed" || kind === "model-unavailable";

  return (
    <section
      aria-labelledby="edge-state-heading"
      role={isAlert ? "alert" : "status"}
      className={clsx(
        "mx-auto w-full max-w-2xl rounded-2xl border p-6 shadow-sm sm:p-8",
        tone.panel,
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            tone.icon
          )}
        >
          <EdgeIcon kind={kind} />
        </span>

        <h2 id="edge-state-heading" className="mt-4 text-h3 text-neutral-900">
          {copy.title}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-body-sm text-neutral-600 leading-relaxed">
          {message ?? copy.message}
        </p>

        {kind === "rejected" && message && (
          <div
            className="mt-4 w-full max-w-md break-words rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-left"
            role="note"
          >
            <h3 className="text-caption text-warning-700">Reason from the service</h3>
            <p className="mt-1 text-body-sm text-warning-800 leading-relaxed">{message}</p>
          </div>
        )}

        {imageUrl && (
          <div className="mt-5 w-full max-w-xs overflow-hidden rounded-xl border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={imageAlt}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="mt-6 w-full rounded-xl bg-neutral-50 px-4 py-4 text-left">
          <h3 className="text-caption text-neutral-500">What to do next</h3>
          <ol role="list" className="mt-2 space-y-2">
            {copy.whatToDoNext.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-neutral-700 shadow-xs"
                >
                  {i + 1}
                </span>
                <span className="text-body-sm text-neutral-700 leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {copy.primaryAction === "retry" && onRetry && (
            <Button type="button" size="lg" onClick={onRetry} className="sm:min-w-[200px]">
              Try again
            </Button>
          )}
          {copy.primaryAction === "retake" && onRetake && (
            <Button type="button" size="lg" onClick={onRetake} className="sm:min-w-[200px]">
              Retake photo
            </Button>
          )}
          {copy.primaryAction === "check-another" && onCheckAnother && (
            <Button type="button" size="lg" onClick={onCheckAnother} className="sm:min-w-[200px]">
              Check another crop
            </Button>
          )}
          {/* Secondary: always offer the alternative path when available. */}
          {copy.primaryAction !== "retake" && onRetake && (
            <Button type="button" variant="outline" size="lg" onClick={onRetake}>
              Retake photo
            </Button>
          )}
          {copy.primaryAction !== "check-another" && onCheckAnother && (
            <Button type="button" variant="secondary" size="lg" onClick={onCheckAnother}>
              Check another crop
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
