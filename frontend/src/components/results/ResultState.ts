"use client";

/**
 * Shared types for the analysis + diagnosis + result experience.
 *
 * UI-ONLY. These types describe the shape the real backend can return
 * later — no ML, no API calls, no treatment claims live here.
 *
 * Conceptual API shape this mirrors:
 * {
 *   crop: "...",
 *   condition: "...",
 *   confidence: 0.87,
 *   confidenceLevel: "high",
 *   explanation: "...",
 *   recommendation: ...
 * }
 */

/** Farmer-friendly confidence buckets. Never present as absolute truth. */
export type ConfidenceLevel = "high" | "moderate" | "low";

/**
 * Backend verdict on the prediction itself (forward-compatible — the
 * current API does not send this yet, so it is always optional).
 * - "accepted": the backend marked the top match as usable.
 * - "uncertain": the backend could not pick a clear winner.
 * - "rejected": the backend refused to produce an accepted prediction.
 */
export type PredictionStatus = "accepted" | "uncertain" | "rejected";

/** One ranked alternative the model considered (UI only, from the API). */
export interface TopPrediction {
  /** Pretty label, e.g. "Early blight". Never a raw class id. */
  label: string;
  /** Raw 0–1 model confidence. Always shown as "model confidence". */
  confidence: number;
}

/** Honest analysis phases — describes UI progress, not fake ML stages. */
export type AnalysisPhase = "preparing" | "analyzing" | "completing";

/** Full analysis lifecycle including failure. */
export type AnalysisStatus = AnalysisPhase | "failed";

/**
 * Every result screen the UI can show.
 * - "success": confident, actionable result
 * - "low-confidence": result exists but should encourage a retry
 * - the rest are edge states, each with its own next step
 */
export type ResultKind =
  | "success"
  | "low-confidence"
  | "uncertain"
  | "rejected"
  | "unknown"
  | "unsupported-crop"
  | "unassessable"
  | "poor-image"
  | "model-unavailable"
  | "failed";

/**
 * Edge states rendered by ResultEdgeState (everything except confident
 * and uncertain-but-answerable results).
 */
export type EdgeKind = Exclude<
  ResultKind,
  "success" | "low-confidence" | "uncertain"
>;

/**
 * Agricultural guidance structure.
 * Prototype content only — never pesticide names, dosages, or
 * treatment claims. The knowledge system supplies real advice later.
 */
export interface Recommendation {
  /** Immediate, safe first steps. */
  whatToDoNow: string[];
  /** Signs to keep an eye on over the next days. */
  whatToWatch: string[];
  /** Single clear next step (e.g. "Show this result to a local agronomist"). */
  nextStep: string;
}

/**
 * Data-driven diagnosis result. A real API response can replace
 * the mock objects in mockResults.ts without changing the UI.
 */
export interface DiagnosisResultData {
  id: string;
  crop: string;
  /** Plain-language condition name, e.g. "Early blight (prototype)". */
  condition: string;
  scientificName?: string;
  /** Raw model confidence 0–1. Displayed only with a "model confidence" label. */
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  /** One or two plain-language sentences. No jargon. */
  explanation: string;
  /** Visible signs behind the result, shown under "Why this result?" */
  observedSigns: string[];
  /** Submitted photo. Null renders a labelled placeholder. */
  imageUrl?: string | null;
  /** Alt text for the submitted photo. */
  imageAlt?: string;
  recommendation: Recommendation;
  /**
   * Future ML explainability hook. When the backend serves a real
   * highlight map, pass its URL to ExplanationSection via `heatmapUrl`.
   * Until then the UI shows a clearly-marked placeholder.
   */
  heatmapUrl?: string | null;
  /** Backend verdict on the prediction (forward-compatible, optional). */
  predictionStatus?: PredictionStatus;
  /** Ranked alternatives the model considered. Optional, UI never fakes it. */
  topPredictions?: TopPrediction[];
  /** Percentage-point gap between the top two candidates. Optional. */
  predictionGapPercent?: number;
  /** True when the backend flagged the healthy pattern for this crop. */
  isHealthy?: boolean;
}

/** Callbacks shared by result screens. Wire to router / capture flow later. */
export interface ResultActionHandlers {
  onCheckAnother?: () => void;
  onRetake?: () => void;
  onViewExplanation?: () => void;
  onContinueToGuidance?: () => void;
  onRetry?: () => void;
}

export interface EdgeCopy {
  title: string;
  message: string;
  /** Concrete next steps, rendered as an ordered list. */
  whatToDoNext: string[];
  /** Which primary button the edge state should offer. */
  primaryAction: "retry" | "retake" | "check-another";
  tone: "neutral" | "warning" | "error" | "info";
}

/**
 * Farmer-friendly copy for every edge state.
 * Each state answers: what happened + what to do next.
 */
export const RESULT_EDGE_COPY: Record<EdgeKind, EdgeCopy> = {
  unknown: {
    title: "We don't recognise this condition yet.",
    message:
      "Your photo was clear, but the visible signs don't match anything we can identify with confidence. That happens — new or rare patterns are hard to judge from one photo.",
    whatToDoNext: [
      "Try a closer photo of the affected leaf in soft daylight.",
      "Include both the damaged area and a healthy part for comparison.",
      "If the problem spreads, show these photos to a local agronomist.",
    ],
    primaryAction: "retake",
    tone: "info",
  },
  "unsupported-crop": {
    title: "We don't support this crop yet.",
    message:
      "AgriSmart AI only recognises a limited set of crops right now. Your photo is fine — we just haven't learned this plant yet.",
    whatToDoNext: [
      "Check the list of supported crops and try one of those.",
      "Take a photo of a supported crop instead.",
      "Ask a local extension officer about this plant in the meantime.",
    ],
    primaryAction: "check-another",
    tone: "neutral",
  },
  unassessable: {
    title: "We can't assess this image.",
    message:
      "The photo doesn't show enough of the plant to work with — it may show hands, soil, or background instead of the affected leaf.",
    whatToDoNext: [
      "Fill the frame with one affected leaf.",
      "Keep the damaged spot inside the picture.",
      "Avoid fingers, tools, or other objects covering the leaf.",
    ],
    primaryAction: "retake",
    tone: "warning",
  },
  "poor-image": {
    title: "This photo is too unclear to assess.",
    message:
      "It's blurry, too dark, or too far away for us to see the symptoms. A clearer photo gives a much more reliable result.",
    whatToDoNext: [
      "Move into soft, even light — out of deep shadow and harsh sun.",
      "Hold your phone steady with both hands and tap the leaf to focus.",
      "Move closer until the affected area fills the frame.",
    ],
    primaryAction: "retake",
    tone: "warning",
  },
  "model-unavailable": {
    title: "Analysis is temporarily unavailable.",
    message:
      "We couldn't reach the analysis service just now. Your photo is safe — nothing was lost. Please try again in a little while.",
    whatToDoNext: [
      "Check your internet connection and try again.",
      "Wait a few minutes if the problem continues.",
      "Keep the photo so you can retry without capturing again.",
    ],
    primaryAction: "retry",
    tone: "error",
  },
  failed: {
    title: "We couldn't finish the analysis.",
    message:
      "Something went wrong while preparing your result. This is on our side, not yours — your photo is fine.",
    whatToDoNext: [
      "Try the analysis once more with the same photo.",
      "If it keeps failing, retake the photo and try again.",
      "Contact support if the problem persists.",
    ],
    primaryAction: "retry",
    tone: "error",
  },
  rejected: {
    title: "We couldn't accept this prediction.",
    message:
      "The analysis service did not accept the result for this photo. The photo itself is fine — the model just couldn't settle on a confident answer. The reason from the service is shown below.",
    whatToDoNext: [
      "Retake the photo closer and in softer, even light.",
      "Include the affected area and a healthy part for comparison.",
      "If the result is still rejected, show the photos to a local agronomist.",
    ],
    primaryAction: "retake",
    tone: "warning",
  },
};

/** Confidence bucket thresholds for a 0–1 model score. */
export function confidenceLevelFromScore(score: number): ConfidenceLevel {
  if (!Number.isFinite(score)) return "low";
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "moderate";
  return "low";
}

/**
 * Display confidence level, respecting the backend's own verdict.
 * When the backend explicitly marks a prediction uncertain/rejected,
 * a raw "high" model score must never be shown as certain.
 */
export function effectiveConfidenceLevel(
  score: number,
  predictionStatus?: PredictionStatus
): ConfidenceLevel {
  const level = confidenceLevelFromScore(score);
  if ((predictionStatus === "uncertain" || predictionStatus === "rejected") && level === "high") {
    return "moderate";
  }
  return level;
}

export const CONFIDENCE_COPY: Record<
  ConfidenceLevel,
  { label: string; description: string }
> = {
  high: {
    label: "High confidence",
    description: "The visible signs match this result well.",
  },
  moderate: {
    label: "Moderate confidence",
    description: "The signs partly match — check the details below.",
  },
  low: {
    label: "Low confidence",
    description: "We're not sure yet — a clearer photo may help.",
  },
};

/** "87" from 0.87 for display next to a "model confidence" label. */
export function formatConfidencePercent(score: number): string {
  if (!Number.isFinite(score)) return "–";
  const clamped = Math.min(1, Math.max(0, score));
  return `${Math.round(clamped * 100)}`;
}
