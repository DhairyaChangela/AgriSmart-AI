"use client";

import { clsx } from "clsx";
import type { ResultEdgeKind } from "./types";
import { RecommendationCard } from "./RecommendationCard";
import { ResultActions } from "./ResultActions";

const EDGE_COPY: Record<ResultEdgeKind, { calm: string }> = {
  unknown: { calm: "We could not classify this result." },
  "unsupported-crop": { calm: "This crop type is not supported in the sample set yet." },
  unassessable: { calm: "The symptoms in this photo are not assessable with enough clarity." },
  "poor-image": { calm: "The photo needs to be clearer before any label is useful." },
  "model-unavailable": { calm: "The analysis service is not connected in this build." },
  failed: { calm: "Something interrupted the analysis run." },
};

export interface ResultEdgeStateProps {
  edge: ResultEdgeKind;
  title: string;
  message: string;
  whatToDoNow: string[];
  nextStep: string;
  className?: string;
}

export function ResultEdgeState({ edge, title, message, whatToDoNow, nextStep, className }: ResultEdgeStateProps) {
  return (
    <article className={clsx("space-y-5", className)}>
      <header className="space-y-2">
        <p className="text-caption font-semibold text-neutral-500">{EDGE_COPY[edge].calm}</p>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
        <p className="text-base leading-relaxed text-neutral-600">{message}</p>
      </header>

      <RecommendationCard items={whatToDoNow} />

      <section aria-labelledby="edge-next-heading">
        <h2 id="edge-next-heading" className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Next step
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{nextStep}</p>
      </section>

      <ResultActions />
    </article>
  );
}
