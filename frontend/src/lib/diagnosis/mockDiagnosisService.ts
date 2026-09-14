import {
  mockHealthyResult,
  mockHighConfidenceResult,
  mockLowConfidenceResult,
  mockModerateConfidenceResult,
  mockUncertainResult,
} from "@/components/results/mockResults";
import type { EdgeKind } from "@/components/results";
import type { SelectedImage } from "@/components/camera";
import type { DiagnosisService } from "./service";
import { DiagnosisServiceError } from "./service";
import type { AnalysisOutcome, AnalysisRequest, PhotoCheck } from "./types";

/**
 * Local, deterministic mock diagnosis provider.
 *
 * Demo hooks (filename keywords, case-insensitive):
 *
 *   checkPhoto:  "blurry" → blurry · "dark" → too-dark · "bright" → too-bright
 *                "hand" | "notleaf" → leaf-not-clear · "unsupported" → unsupported
 *                anything else → good
 *
 *   analyze:     "healthy" → healthy · "lowconf" → low confidence
 *                "moderate" → moderate · "uncertain" → uncertain result
 *                "rejected" | "invalid" → rejected edge (with reason)
 *                "unknown" → unknown edge
 *                "unsupported-crop" → unsupported-crop edge · "unassessable" → edge
 *                "poor" → poor-image edge · "unavailable" → model-unavailable edge
 *                "fail" → rejects (simulated service failure)
 *                anything else → high-confidence tomato early-blight result
 *
 * These keywords deliberately mirror what a reviewer or automated QA would
 * name a fixture photo, so every journey state is reachable without UI hacks.
 * A real backend replaces this file with HTTP calls and the keywords disappear.
 */

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function attachPhoto(result: import("@/components/results").DiagnosisResultData, image: SelectedImage) {
  return {
    ...result,
    imageUrl: image.previewUrl ?? result.imageUrl,
    imageAlt: (!image.previewUrl ? `Your photo of a ${result.crop.toLowerCase()} leaf` : result.imageAlt) ?? result.imageAlt,
  };
}

function lowerName(image: SelectedImage): string {
  return image.name.toLowerCase();
}

function has(image: SelectedImage, ...keywords: string[]): boolean {
  const n = lowerName(image);
  return keywords.some((k) => n.includes(k));
}

export const mockDiagnosisService: DiagnosisService = {
  id: "mock",
  label: "Local prototype provider",

  async checkPhoto(image: SelectedImage): Promise<PhotoCheck> {
    await delay(1500);
    if (has(image, "blurry")) return { verdict: "blurry" };
    if (has(image, "dark")) return { verdict: "too-dark" };
    if (has(image, "bright")) return { verdict: "too-bright" };
    if (has(image, "hand", "notleaf")) return { verdict: "leaf-not-clear" };
    if (has(image, "unsupported")) return { verdict: "unsupported" };
    return { verdict: "good" };
  },

  async analyze({ image, requestId }: AnalysisRequest): Promise<AnalysisOutcome> {
    await delay(4600);
    if (!requestId) {
      // Structural guards only — unreachable in the current UI.
      throw new DiagnosisServiceError("Analysis could not be identified.", "analysis-failed");
    }

    if (has(image, "fail")) {
      throw new DiagnosisServiceError(
        "The analysis service did not respond in time. Try again with the same photo.",
        "analysis-failed"
      );
    }

    if (has(image, "unavailable")) {
      return { kind: "edge", edge: "model-unavailable" };
    }
    if (has(image, "rejected", "invalid")) {
      return {
        kind: "edge",
        edge: "rejected",
        message: "Mock validation: the model could not settle on a confident match for this photo.",
      };
    }
    if (has(image, "unknown")) {
      return { kind: "edge", edge: "unknown" };
    }
    if (has(image, "unsupported-crop", "nonnative")) {
      return { kind: "edge", edge: "unsupported-crop" };
    }
    if (has(image, "unassessable")) {
      return { kind: "edge", edge: "unassessable" };
    }
    if (has(image, "poor")) {
      return { kind: "edge", edge: "poor-image" };
    }
    if (has(image, "healthy")) {
      return { kind: "result", result: attachPhoto(mockHealthyResult, image) };
    }
    if (has(image, "uncertain")) {
      return { kind: "result", result: attachPhoto(mockUncertainResult, image) };
    }
    if (has(image, "lowconf")) {
      return { kind: "result", result: attachPhoto(mockLowConfidenceResult, image) };
    }
    if (has(image, "moderate")) {
      return { kind: "result", result: attachPhoto(mockModerateConfidenceResult, image) };
    }
    return { kind: "result", result: attachPhoto(mockHighConfidenceResult, image) };
  },
};

/** Future provider registry — the journey resolves the active one here. */
export function getDiagnosisService(): DiagnosisService {
  return mockDiagnosisService;
}

export type { EdgeKind };