"use client";

export { AnalysisState, type AnalysisStateProps } from "./AnalysisState";
export { DiagnosisResult, type DiagnosisResultProps } from "./DiagnosisResult";
export {
  ConfidenceIndicator,
  type ConfidenceIndicatorProps,
} from "./ConfidenceIndicator";
export {
  ExplanationSection,
  type ExplanationSectionProps,
} from "./ExplanationSection";
export {
  RecommendationCard,
  type RecommendationCardProps,
} from "./RecommendationCard";
export {
  TopPredictionsCard,
  type TopPredictionsCardProps,
} from "./TopPredictionsCard";
export { ResultActions, type ResultActionsProps } from "./ResultActions";
export { ResultEdgeState, type ResultEdgeStateProps } from "./ResultEdgeState";
export {
  type AnalysisPhase,
  type AnalysisStatus,
  type ConfidenceLevel,
  type DiagnosisResultData,
  type EdgeKind,
  type EdgeCopy,
  type PredictionStatus,
  type TopPrediction,
  type Recommendation,
  type ResultActionHandlers,
  type ResultKind,
  RESULT_EDGE_COPY,
  CONFIDENCE_COPY,
  confidenceLevelFromScore,
  effectiveConfidenceLevel,
  formatConfidencePercent,
} from "./ResultState";
export {
  mockHealthyResult,
  mockHighConfidenceResult,
  mockLowConfidenceResult,
  mockModerateConfidenceResult,
  mockUncertainResult,
  mockResultsById,
  MOCK_DATA_NOTICE,
} from "./mockResults";
