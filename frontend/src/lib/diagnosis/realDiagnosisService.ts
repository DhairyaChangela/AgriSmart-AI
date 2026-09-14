import type { SelectedImage } from "@/components/camera";
import type { DiagnosisResultData } from "@/components/results";
import {
  effectiveConfidenceLevel,
  formatConfidencePercent,
} from "@/components/results";
import type { PredictionStatus, TopPrediction } from "@/components/results";
import type { DiagnosisService } from "./service";
import { DiagnosisServiceError } from "./service";
import type {
  AnalysisOutcome,
  AnalysisRequest,
  PhotoCheck,
} from "./types";
import { postFormData, ApiHttpError, getApiBaseUrl } from "./apiClient";

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
 * `uncertain` swaps in retake-first advice so nobody acts on a weak match.
 */
function recommendationFor(crop: string, isHealthy: boolean, uncertain = false) {
  if (uncertain) {
    return {
      whatToDoNow: [
        "Don't act on this result yet — the model is not confident about it.",
        "Take a closer photo of the affected leaf in soft, even light.",
        "Keep affected plants separate from healthy ones where you can.",
      ],
      whatToWatch: [
        "Whether the signs spread to new leaves over the next few days.",
        "New yellowing, wilting, or leaf drop.",
        "Changes after watering or weather swings.",
      ],
      nextStep:
        "Retake the photo and check again before treating anything.",
    };
  }
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

/** First non-empty string among the candidate keys, or undefined. */
function readString(
  payload: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

/** Any finite number, or undefined. */
function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

/**
 * Normalize the optional `top_predictions` array. Accepts a few common
 * field names so the client tolerates backend naming drift; entries that
 * cannot be validated are dropped. Never fabricates a candidate.
 */
function toTopPredictions(value: unknown): TopPrediction[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out: TopPrediction[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    const labelRaw =
      readString(entry, ["class", "class_name", "disease", "label", "name"]) ??
      "";
    if (!labelRaw) continue;
    let conf = readNumber(entry.confidence);
    if (conf === undefined) {
      const percent = readNumber(entry.confidence_percent);
      if (percent !== undefined) conf = percent / 100;
    }
    if (conf === undefined || conf < 0 || conf > 1) continue;
    out.push({ label: prettyLabel(labelRaw), confidence: conf });
  }
  out.sort((a, b) => b.confidence - a.confidence);
  return out.length > 0 ? out : undefined;
}

/**
 * Percentage-point gap between the top two candidates. Prefers the
 * backend-declared `prediction_gap_percent`, else derives it from the
 * top predictions. Only ever computed from real numbers.
 */
function predictionGap(
  topPredictions: TopPrediction[] | undefined,
  declaredPercent: number | undefined
): number | undefined {
  if (declaredPercent !== undefined) {
    return Math.min(100, Math.max(0, declaredPercent));
  }
  if (topPredictions && topPredictions.length >= 2) {
    const gap = Math.abs(
      topPredictions[0].confidence - topPredictions[1].confidence
    );
    return Math.round(gap * 1000) / 10;
  }
  return undefined;
}

interface ExplanationInput {
  crop: string;
  diseaseName: string;
  percent: string;
  isHealthy: boolean;
  predictionStatus: PredictionStatus;
  predictionGapPercent?: number;
}

/** Plain-language explanation assembled strictly from backend fields. */
function buildExplanation(input: ExplanationInput): string {
  const { crop, diseaseName, percent, isHealthy, predictionStatus, predictionGapPercent } =
    input;
  if (predictionStatus === "uncertain") {
    const base = `The model could not confidently pick one match for ${crop}. Its top match was ${diseaseName} at ${percent}% model confidence`;
    if (predictionGapPercent !== undefined) {
      return `${base}, only ${predictionGapPercent} percentage points above the next candidate. Treat this as uncertain — a clearer photo will help more than acting on it.`;
    }
    return `${base}. Treat this as uncertain — a clearer photo will help more than acting on it.`;
  }
  if (isHealthy) {
    return `The model matched your photo to the healthy pattern for ${crop} with ${percent}% confidence. Keep an eye on the plant as it grows.`;
  }
  return `The model matched your photo to ${diseaseName} in ${crop} with ${percent}% confidence. This is the top result from the trained crop-disease model — confirm it with a local expert before acting.`;
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

  // Rejected: the backend refuses an accepted prediction. Surfaced as a
  // clearly-labelled edge that carries the backend's own reason.
  const declaredStatus = readString(payload, ["prediction_status"]);
  if (status === "rejected" || declaredStatus === "rejected" || payload.valid === false) {
    const message =
      readString(payload, ["validation_message", "message", "detail"]) ??
      undefined;
    return { kind: "edge", edge: "rejected", message };
  }

  if (status !== "success") {
    throw new DiagnosisServiceError(
      "The analysis service returned an unexpected response.",
      "analysis-failed"
    );
  }

  const modelClass = readString(payload, ["class", "class_name", "predicted_class"]);
  const crop = readString(payload, ["crop"]);
  const disease = readString(payload, ["disease", "condition"]);

  if (!modelClass || !crop || !disease) {
    throw new DiagnosisServiceError(
      "The analysis response was missing the prediction details.",
      "analysis-failed"
    );
  }

  let rawConfidence = readNumber(payload.confidence);
  if (rawConfidence === undefined) {
    const percent = readNumber(payload.confidence_percent);
    if (percent !== undefined) rawConfidence = percent / 100;
  }
  if (rawConfidence === undefined || rawConfidence < 0 || rawConfidence > 1) {
    throw new DiagnosisServiceError(
      "The analysis response contained an invalid confidence score.",
      "analysis-failed"
    );
  }

  const predictionStatus: PredictionStatus =
    declaredStatus === "uncertain" ? "uncertain" : "accepted";
  const topPredictions = toTopPredictions(payload.top_predictions);
  const predictionGapPercent = predictionGap(
    topPredictions,
    readNumber(payload.prediction_gap_percent)
  );

  const isHealthy = /healthy/i.test(disease);
  const diseaseName = prettyLabel(disease);
  const percent = formatConfidencePercent(rawConfidence);
  const condition = isHealthy
    ? "Looks healthy"
    : diseaseName.length > 0
      ? diseaseName
      : "Unknown condition";
  const recommendation = recommendationFor(
    crop,
    isHealthy,
    predictionStatus === "uncertain"
  );

  const observedSigns: string[] =
    predictionStatus === "uncertain"
      ? [
          `The model's top match was "${diseaseName}" at ${percent}% model confidence.`,
          ...(predictionGapPercent !== undefined
            ? [`The gap to the next candidate was only ${predictionGapPercent} percentage points.`]
            : []),
          "Consider the other possible matches listed below before deciding anything.",
        ]
      : [
          `The model's top match was "${diseaseName}" for ${crop}.`,
          `It reported ${percent}% confidence in that match.`,
          "Treat this as a starting point — confirm what you see on the plant and with an expert.",
        ];

  const result: DiagnosisResultData = {
    id: `api-${requestId}`,
    crop: prettyLabel(crop) || crop,
    condition,
    confidence: rawConfidence,
    confidenceLevel: effectiveConfidenceLevel(rawConfidence, predictionStatus),
    explanation: buildExplanation({
      crop: prettyLabel(crop) || crop,
      diseaseName,
      percent,
      isHealthy,
      predictionStatus,
      predictionGapPercent,
    }),
    observedSigns,
    imageUrl: image.previewUrl ?? null,
    imageAlt: `${image.name} — the photo analysed`,
    recommendation,
    heatmapUrl: null,
    predictionStatus,
    topPredictions,
    predictionGapPercent,
    isHealthy,
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
      const endpoint = `${getApiBaseUrl()}/predict`;
      if (err instanceof ApiHttpError) {
        // Developer diagnostics: HTTP failure with a real response.
        console.warn("[diagnosis] /predict HTTP error", {
          url: endpoint,
          status: err.status,
          detail: err.detail ?? null,
        });
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
        // Unhandled 4xx (e.g. 422 missing field) — a request-level problem,
        // not an image quality verdict and not a down service.
        throw new DiagnosisServiceError(
          "The analysis request could not be completed. Try again.",
          "analysis-failed"
        );
      }
      // Transport error / timeout — no response at all.
      const rawMessage = err instanceof Error ? err.message : String(err);
      console.warn("[diagnosis] /predict transport failure", {
        url: endpoint,
        error: rawMessage,
        kind: /timed out|aborterror/i.test(rawMessage) ? "timeout" : "connection",
      });
      throw new DiagnosisServiceError(
        "The analysis service is not available. Check your connection and try again.",
        "service-unavailable"
      );
    }

    try {
      return normalizePredictResponse(payload, image, requestId);
    } catch (err) {
      if (err instanceof DiagnosisServiceError) {
        // Developer diagnostics: a response arrived but could not be used.
        console.warn("[diagnosis] /predict response unusable", {
          url: `${getApiBaseUrl()}/predict`,
          code: err.code,
          message: err.message,
        });
      }
      throw err;
    }
  },
};

function getDiagnosisService(): DiagnosisService {
  return realDiagnosisService;
}

export { getDiagnosisService };