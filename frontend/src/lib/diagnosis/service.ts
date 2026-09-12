import type { SelectedImage } from "@/components/camera";
import type { AnalysisOutcome, AnalysisRequest, PhotoCheck } from "./types";

/**
 * Provider contract for the diagnosis journey.
 *
 * Implementations:
 * - `realDiagnosisService` (default — FastAPI `POST /predict`)
 *
 * The app layer only ever depends on this interface.
 */
export interface DiagnosisService {
  /** Stable id used for logging / future provider switching. */
  readonly id: string;
  /** Short human label, shown in subtle "provider" notes. */
  readonly label: string;

  /** Believable pre-analysis validation gate. */
  checkPhoto(image: SelectedImage): Promise<PhotoCheck>;

  /** Full analysis → a confident result or a clearly-labelled edge outcome. */
  analyze(request: AnalysisRequest): Promise<AnalysisOutcome>;
}

export class DiagnosisServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "analysis-failed" | "service-unavailable"
  ) {
    super(message);
    this.name = "DiagnosisServiceError";
  }
}