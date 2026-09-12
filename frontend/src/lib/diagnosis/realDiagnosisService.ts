import type { SelectedImage } from "@/components/camera";
import type { DiagnosisResultData } from "@/components/results";
import {
  confidenceLevelFromScore,
  formatConfidencePercent,
} from "@/components/results";
import type { DiagnosisService } from "./service";
import { DiagnosisServiceError } from "./service";
import type {
  AnalysisOutcome,
  AnalysisRequest,
  PhotoCheck,
} from "./types";
import { postFormData, ApiHttpError } from "./apiClient";

/**
 * Real diagnosis provider — connects the journey to the AgriSmart FastAPI
 * backend (`POST /predict`).
 *
 * The UI only ever sees the shared DiagnosisService contract; every backend
 * detail (field name, multipart encoding, status codes, JSON shape) is
 * normalised in here so the screens never change.
 */

/** Mirrors the backend allowlist in `app/backend/api/predict.py`. */
const BACKEND_ALLOWED_MIME_TYPES: readonly string[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const BACKEND_ALLOWED_EXTENSIONS: readonly string[] = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

/**
 * The backend `POST /predict` returns JSON fields with `unknown` types;
 * `normalizePredictResponse` narrows and validates every field below.
 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** "Early_blight" → "Early blight"; never fabricates names. */
function prettyLabel(raw: string): string {
  return raw.replace(/_/g, " ").trim();
}

/**
 * Farmer-safe generic guidance built from the real model output only.
 * No pesticide names, dosages, or treatment claims — the backend returns
 * a class label and a confidence score, and this stays within that.
 */
function recommendationFor(crop: string, isHealthy: boolean) {
  if (isHealthy) {
    return {
      whatToDoNow: [
        "No action needed — the model matched the healthy pattern for this crop.",
        "Continue your normal care and watching routine.",
      ],
      whatToWatch: [
        "New spots, yellowing, or curling on young leaves.",
        "Changes in the plant after heavy rain or long dry spells.",
      ],
      nextStep:
        "Check again if you notice any change in the leaves.",
    };
  }
  return {
    whatToDoNow: [
      "Compare this result against the actual signs on your plant before acting.",
      "Keep affected plants separate from healthy ones where you can.",
      "Take this result and your photo to a local agronomist.",
    ],
    whatToWatch: [
      "Whether the signs spread to new leaves over the next few days.",
      "New yellowing, wilting, or leaf drop.",
      "Changes after watering or weather swings.",
    ],
    nextStep:
      "Show this result and your photo to a local agronomist before treating anything.",
  };
}

function normalizePredictResponse(
  payload: unknown,
  image: SelectedImage,
  requestId: string
): AnalysisOutcome {
  if (!isRecord(payload)) {
    throw new DiagnosisServiceError(
      "The analysis service returned an unexpected response.",
      "analysis-failed"
    );
  }

  const status = payload.status;
  if (status === "model_not_ready") {
    return { kind: "edge", edge: "model-unavailable" };
  }
  if (status !== "success") {
    throw new DiagnosisServiceError(
      "The analysis service returned an unexpected response.",
      "analysis-failed"
    );
  }

  const { class: modelClass, crop, disease, confidence } = payload;

  if (
    typeof modelClass !== "string" ||
    modelClass.length === 0 ||
    typeof crop !== "string" ||
    crop.length === 0 ||
    typeof disease !== "string" ||
    disease.length === 0
  ) {
    throw new DiagnosisServiceError(
      "The analysis response was missing the prediction details.",
      "analysis-failed"
    );
  }

  const rawConfidence =
    typeof confidence === "number" ? confidence : Number.NaN;
  if (
    !Number.isFinite(rawConfidence) ||
    rawConfidence < 0 ||
    rawConfidence > 1
  ) {
    throw new DiagnosisServiceError(
      "The analysis response contained an invalid confidence score.",
      "analysis-failed"
    );
  }

  const isHealthy = /healthy/i.test(disease);
  const diseaseName = prettyLabel(disease);
  const percent = formatConfidencePercent(rawConfidence);
  const condition = isHealthy
    ? "Looks healthy"
    : diseaseName.length > 0
      ? diseaseName
      : "Unknown condition";
  const recommendation = recommendationFor(crop, isHealthy);

  const result: DiagnosisResultData = {
    id: `api-${requestId}`,
    crop: prettyLabel(crop) || crop,
    condition,
    confidence: rawConfidence,
    confidenceLevel: confidenceLevelFromScore(rawConfidence),
    explanation: isHealthy
      ? `The model matched your photo to the healthy pattern for ${prettyLabel(crop) || crop} with ${percent}% confidence. Keep an eye on the plant as it grows.`
      : `The model matched your photo to ${diseaseName} in ${prettyLabel(crop) || crop} with ${percent}% confidence. This is the top result from the trained crop-disease model — confirm it with a local expert before acting.`,
    observedSigns: [
      `The model's top match was "${diseaseName}" for ${prettyLabel(crop) || crop}.`,
      `It reported ${percent}% confidence in that match.`,
      "Treat this as a starting point — confirm what you see on the plant and with an expert.",
    ],
    imageUrl: image.previewUrl ?? null,
    imageAlt: `${image.name} — the photo analysed`,
    recommendation,
    heatmapUrl: null,
  };

  return { kind: "result", result };
}

export const realDiagnosisService: DiagnosisService = {
  id: "api",
  label: "AgriSmart API",

  /**
   * Local format gate that mirrors what the backend itself validates
   * (MIME type + extension allowlist). No blur/lighting claims — those
   * would need a model the client cannot run. The authoritative check
   * still happens server-side during analysis.
   */
  async checkPhoto(image: SelectedImage): Promise<PhotoCheck> {
    const mimeOk = BACKEND_ALLOWED_MIME_TYPES.includes(image.type);
    const lowerName = image.name.toLowerCase();
    const extOk = BACKEND_ALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext)
    );
    if (!mimeOk && !extOk) {
      return {
        verdict: "unsupported",
        notice: "Choose a JPG, PNG, or WEBP photo instead.",
      };
    }
    return { verdict: "good" };
  },

  async analyze({ image, requestId }: AnalysisRequest): Promise<AnalysisOutcome> {
    if (!requestId) {
      throw new DiagnosisServiceError(
        "Analysis could not be identified.",
        "analysis-failed"
      );
    }

    const formData = new FormData();
    formData.append(
      "file",
      image.file,
      image.name || "crop-photo.jpg"
    );

    let payload: unknown;
    try {
      payload = await postFormData("/predict", formData);
    } catch (err) {
      if (err instanceof ApiHttpError) {
        if (err.status === 400) {
          // The backend rejected the image itself (bad type or unreadable).
          return { kind: "edge", edge: "poor-image" };
        }
        if (err.status >= 500) {
          throw new DiagnosisServiceError(
            "The analysis service ran into a problem. Try again in a moment.",
            "analysis-failed"
          );
        }
        throw new DiagnosisServiceError(
          "The analysis service is not available. Check your connection and try again.",
          "service-unavailable"
        );
      }
      // Transport error / timeout — no response at all.
      throw new DiagnosisServiceError(
        "The analysis service is not available. Check your connection and try again.",
        "service-unavailable"
      );
    }

    return normalizePredictResponse(payload, image, requestId);
  },
};

function getDiagnosisService(): DiagnosisService {
  return realDiagnosisService;
}

export { getDiagnosisService };