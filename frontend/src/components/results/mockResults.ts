"use client";

import type { DiagnosisResultData } from "./ResultState";

/**
 * Small local mock data for the result experience.
 *
 * PROTOTYPE DATA — clearly labelled, safe by design:
 * - No pesticide names, dosages, or treatment claims.
 * - Guidance is generic crop-care hygiene any farmer already knows.
 * - Condition names carry a "(prototype)" suffix so nobody mistakes
 *   them for a real diagnosis.
 *
 * A real backend response with the same shape can replace these
 * objects 1:1 — components never import disease-specific logic.
 */

export const MOCK_DATA_NOTICE =
  "Prototype result — sample data for UI development. Not a real diagnosis.";

function baseRecommendation(crop: string) {
  return {
    whatToDoNow: [
      `Separate the affected ${crop} leaves from healthy plants where you can.`,
      "Avoid handling healthy plants right after touching affected ones.",
      "Keep the area around the plant clear of fallen leaves.",
    ],
    whatToWatch: [
      "Whether spots grow bigger or spread to new leaves over the next few days.",
      "New yellowing, wilting, or leaf drop.",
      "Signs of pests on the underside of leaves.",
    ],
    nextStep:
      "Show this result and your photo to a local agronomist before treating anything.",
  };
}

export const mockHighConfidenceResult: DiagnosisResultData = {
  id: "mock-high-001",
  crop: "Tomato",
  condition: "Early blight pattern (prototype)",
  scientificName: "Prototype sample — not a real diagnosis",
  confidence: 0.87,
  confidenceLevel: "high",
  explanation:
    "The leaves show dark, ringed spots with yellowing around the edges — a pattern that commonly points to early blight in tomato. The spots are clear and well-lit in your photo, which is why the match is strong.",
  observedSigns: [
    "Dark brown spots with faint concentric rings on older leaves",
    "Yellowing tissue around the edges of the spots",
    "Spots mostly on lower leaves, spreading upward",
  ],
  imageUrl: null,
  imageAlt: "Submitted photo of a tomato leaf",
  recommendation: baseRecommendation("tomato"),
  heatmapUrl: null,
};

export const mockModerateConfidenceResult: DiagnosisResultData = {
  id: "mock-moderate-001",
  crop: "Maize",
  condition: "Leaf spot pattern (prototype)",
  scientificName: "Prototype sample — not a real diagnosis",
  confidence: 0.64,
  confidenceLevel: "moderate",
  explanation:
    "There are pale, oval spots scattered across the leaf, which partly matches a common leaf spot pattern in maize. Some spots are faint, so a closer photo could make the result more reliable.",
  observedSigns: [
    "Pale oval spots scattered across the leaf surface",
    "Spot edges less defined than a strong match would show",
    "No clear spreading pattern visible in this photo",
  ],
  imageUrl: null,
  imageAlt: "Submitted photo of a maize leaf",
  recommendation: baseRecommendation("maize"),
  heatmapUrl: null,
};

export const mockLowConfidenceResult: DiagnosisResultData = {
  id: "mock-low-001",
  crop: "Cassava",
  condition: "Unclear leaf pattern (prototype)",
  scientificName: "Prototype sample — not a real diagnosis",
  confidence: 0.38,
  confidenceLevel: "low",
  explanation:
    "We can see some discolouration, but the photo is not clear enough to match it to a known pattern with confidence. The lighting is uneven and the affected area is small in the frame.",
  observedSigns: [
    "Patchy discolouration, edges hard to see",
    "Affected area small in the frame",
    "Uneven lighting across the leaf",
  ],
  imageUrl: null,
  imageAlt: "Submitted photo of a cassava leaf",
  recommendation: {
    whatToDoNow: [
      "Don't act on this result yet — it isn't reliable enough.",
      "Keep the plant as it is and take a closer photo first.",
    ],
    whatToWatch: [
      "Whether the discolouration spreads or changes colour.",
      "Any new spots, curling, or wilting.",
    ],
    nextStep:
      "Retake the photo closer and in better light, then check again.",
  },
  heatmapUrl: null,
};

export const mockHealthyResult: DiagnosisResultData = {
  id: "mock-healthy-001",
  crop: "Tomato",
  condition: "Looks healthy (prototype)",
  scientificName: "Prototype sample — not a real assessment",
  confidence: 0.91,
  confidenceLevel: "high",
  explanation:
    "The leaf looks green and even, with no clear spots, discolouration, or damage visible in your photo. Keep watching the plant as it grows.",
  observedSigns: [
    "Even green colour across the leaf",
    "No spots, holes, or discoloured edges visible",
    "Leaf surface looks smooth and intact",
  ],
  imageUrl: null,
  imageAlt: "Submitted photo of a tomato leaf",
  recommendation: {
    whatToDoNow: [
      "No action needed — your plant looks fine in this photo.",
      "Continue your normal watering and care routine.",
    ],
    whatToWatch: [
      "New spots, yellowing, or curling on young leaves.",
      "Changes after heavy rain or long dry spells.",
    ],
    nextStep: "Check again if you notice any change in the leaves.",
  },
  heatmapUrl: null,
};

/** All mock results keyed for demos / storybook-style previews. */
export const mockResultsById: Record<string, DiagnosisResultData> = {
  [mockHighConfidenceResult.id]: mockHighConfidenceResult,
  [mockModerateConfidenceResult.id]: mockModerateConfidenceResult,
  [mockLowConfidenceResult.id]: mockLowConfidenceResult,
  [mockHealthyResult.id]: mockHealthyResult,
};
