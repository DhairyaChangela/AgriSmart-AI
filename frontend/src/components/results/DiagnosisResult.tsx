"use client";

import Image from "next/image";
import { clsx } from "clsx";
import type { ResultPayload } from "./types";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { ExplanationSection } from "./ExplanationSection";
import { RecommendationCard } from "./RecommendationCard";
import { ResultActions } from "./ResultActions";
import { ResultEdgeState } from "./ResultEdgeState";

export interface DiagnosisResultProps {
  payload: ResultPayload;
  imageUrl?: string | null;
  imageAlt?: string;
  className?: string;
  onRetryAnalysis?: () => void;
}

export function DiagnosisResult({ payload, imageUrl, imageAlt, className, onRetryAnalysis }: DiagnosisResultProps) {
  if (payload.kind === "edge") {
    return (
      <ResultEdgeState
        edge={payload.edge}
        title={payload.title}
        message={payload.message}
        whatToDoNow={payload.whatToDoNow}
        nextStep={payload.nextStep}
        className={className}
      />
    );
  }

  const isHealthy = payload.kind === "healthy";

  return (
    <article className={clsx("space-y-6", className)}>
      {imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={imageUrl}
              alt={imageAlt ?? "Leaf photo used for this sample result"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 640px"
              unoptimized
            />
          </div>
        </div>
      )}

      <header className="space-y-3">
        <p className="text-caption font-semibold text-primary-700">
          {isHealthy ? "Sample result · healthy appearance" : "Sample diagnosis"}
        </p>
        {"cropLabel" in payload && payload.cropLabel && (
          <p className="text-xs font-medium text-neutral-500">{payload.cropLabel}</p>
        )}
        <h1 className="text-2xl font-bold leading-snug tracking-tight text-neutral-900 sm:text-3xl">{payload.finding}</h1>
      </header>

      <ConfidenceIndicator level={payload.confidence} />

      <ExplanationSection whatWeSee={payload.whatWeSee} why={payload.why} />

      <RecommendationCard items={payload.whatToDoNow} />

      <section aria-labelledby="watch-heading" className="rounded-xl border border-neutral-200 bg-white px-4 py-4">
        <h2 id="watch-heading" className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          What to watch
        </h2>
        <ul className="mt-2 space-y-2" role="list">
          {payload.whatToWatch.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-neutral-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="result-next-heading">
        <h2 id="result-next-heading" className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Next step
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{payload.nextStep}</p>
      </section>

      <ResultActions onRetry={onRetryAnalysis} />

      <p className="text-xs leading-relaxed text-neutral-500" role="note">
        Prototype sample content — not a certified diagnosis. No pesticide rates or guaranteed treatments are provided.
      </p>
    </article>
  );
}
