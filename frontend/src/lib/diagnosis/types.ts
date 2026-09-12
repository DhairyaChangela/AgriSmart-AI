import type { DiagnosisResultData } from "@/components/results";
import type { EdgeKind } from "@/components/results";
import type { ImageQualityKind, SelectedImage } from "@/components/camera";

/**
 * Diagnosis service contract — the single boundary between the journey UI
 * and whatever provides photo validation + analysis.
 *
 * Implemented today by `realDiagnosisService` (FastAPI `POST /predict`).
 * The UI never imports implementation details — swap the provider and the
 * journey upgrades without touching a single screen.
 *
 * UI-ONLY promises kept by every implementation:
 * - Never claim a real ML model when one is not wired in.
 * - Confidence levels are first-class outputs (see ResultState.ts).
 */

/** Photo-quality verdict — reuses the exact states the camera UI already speaks. */
export type PhotoVerdict = ImageQualityKind;

export interface PhotoCheck {
  verdict: PhotoVerdict;
  /** Optional farmer-friendly note attached to the verdict. */
  notice?: string;
}

export type AnalysisOutcome =
  | { kind: "result"; result: DiagnosisResultData }
  | { kind: "edge"; edge: EdgeKind };

export interface AnalysisRequest {
  image: SelectedImage;
  /** Stable id per single run — lets the UI ignore stale completions. */
  requestId: string;
}

export const ANALYSIS_SERVICE_NOTE =
  "Analysis runs through the live AgriSmart crop-disease model.";