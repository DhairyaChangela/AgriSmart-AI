"use client";

import { clsx } from "clsx";
import { Badge } from "@/components/ui/Badge";
import type { DiagnosisResultData, ResultActionHandlers } from "./ResultState";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { ExplanationSection } from "./ExplanationSection";
import { RecommendationCard } from "./RecommendationCard";
import { ResultActions } from "./ResultActions";
import { MOCK_DATA_NOTICE } from "./mockResults";

export interface DiagnosisResultProps extends ResultActionHandlers {
  result: DiagnosisResultData;
  /** Marks mock content as prototype data. Real API data sets this false. */
  isPrototype?: boolean;
  defaultExplanationOpen?: boolean;
  className?: string;
}

function ResultImage({
  imageUrl,
  alt,
  crop,
}: {
  imageUrl?: string | null;
  alt?: string;
  crop: string;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={alt ?? `Photo of ${crop} submitted for analysis`}
        className="aspect-[4/3] h-full w-full object-cover"
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={`No photo preview available for this ${crop} result`}
      className="flex aspect-[4/3] h-full w-full flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-400"
    >
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="px-4 text-center text-xs">Your crop photo will appear here</span>
    </span>
  );
}

/**
 * Premium success / low-confidence result screen.
 *
 * Answers, in order: what was detected, how confident the system is,
 * why, and what to do next — in plain language for a nontechnical farmer.
 *
 * Low confidence renders a distinct encouraging banner and reframes the
 * condition as a "possible match" with retry as the primary path.
 */
export function DiagnosisResult({
  result,
  isPrototype = true,
  defaultExplanationOpen = true,
  onCheckAnother,
  onRetake,
  onViewExplanation,
  onContinueToGuidance,
  className,
}: DiagnosisResultProps) {
  const isLowConfidence = result.confidenceLevel === "low";

  const scrollToExplanation = () => {
    if (onViewExplanation) {
      onViewExplanation();
      return;
    }
    document
      .getElementById("why-this-result")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article
      aria-labelledby="diagnosis-heading"
      className={clsx("mx-auto w-full max-w-5xl", className)}
    >
      {/* Low-confidence banner — encouraging, never alarming. */}
      {isLowConfidence && (
        <div
          role="status"
          className="mb-5 rounded-2xl border border-warning-100 bg-warning-50 px-5 py-4 sm:px-6"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-warning-600 shadow-xs"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                We&apos;re not fully confident about this result.
              </h2>
              <p className="mt-1 text-body-sm text-neutral-700 leading-relaxed">
                This is only a possible match. Try taking a closer, clearer
                photo in soft daylight — it makes the next analysis much more
                reliable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header card: photo + primary result. */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative bg-neutral-100 lg:min-h-full">
            <ResultImage
              imageUrl={result.imageUrl ?? null}
              alt={result.imageAlt}
              crop={result.crop}
            />
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm">
                {result.crop}
              </Badge>
              {isPrototype && (
                <Badge variant="default" size="sm">
                  Prototype data
                </Badge>
              )}
            </div>

            <p className="mt-3 text-caption text-neutral-500">
              {isLowConfidence ? "Possible match" : "Detected condition"}
            </p>
            <h1
              id="diagnosis-heading"
              tabIndex={-1}
              className="mt-1 text-h2 text-neutral-900 focus-visible:outline-none"
            >
              {result.condition}
            </h1>
            {result.scientificName && (
              <p className="mt-1 text-body-sm italic text-neutral-500">
                {result.scientificName}
              </p>
            )}

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <ConfidenceIndicator
                level={result.confidenceLevel}
                score={result.confidence}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body: explanation + guidance, stacked on mobile, two columns on desktop. */}
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <div id="why-this-result" className="scroll-mt-24">
          <ExplanationSection
            explanation={result.explanation}
            observedSigns={result.observedSigns}
            heatmapUrl={result.heatmapUrl ?? null}
            defaultOpen={defaultExplanationOpen}
          />
        </div>
        <RecommendationCard
          recommendation={result.recommendation}
          isPrototype={isPrototype}
        />
      </div>

      {isPrototype && (
        <p className="mt-4 rounded-xl bg-neutral-100 px-4 py-2.5 text-xs leading-relaxed text-neutral-500">
          {MOCK_DATA_NOTICE}
        </p>
      )}

      {/* Actions: primary forward path, clearly differentiated. */}
      <div className="mx-auto mt-6 max-w-2xl">
        <ResultActions
          onCheckAnother={onCheckAnother}
          onRetake={onRetake}
          onViewExplanation={scrollToExplanation}
          onContinueToGuidance={onContinueToGuidance}
          continueLabel={
            isLowConfidence ? "Try a clearer photo first" : "Continue to guidance"
          }
        />
      </div>
    </article>
  );
}
