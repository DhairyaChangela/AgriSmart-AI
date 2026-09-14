"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CropCapture } from "@/components/camera";
import type { CaptureResult, SelectedImage } from "@/components/camera";
import { AnalysisState, DiagnosisResult, ResultEdgeState } from "@/components/results";
import type { AnalysisStatus } from "@/components/results";
import { setAgriBotContext } from "@/lib/assistant/agribotContext";
import {
  getDiagnosisService,
  DiagnosisServiceError,
  ANALYSIS_SERVICE_NOTE,
  type AnalysisOutcome,
  type PhotoVerdict,
} from "@/lib/diagnosis";
import { JourneyProgress, type JourneyStep } from "./JourneyProgress";
import { QualityCheckStage } from "./QualityCheckStage";

type Stage =
  | { name: "capture" }
  | { name: "quality" }
  | { name: "analysis" }
  | { name: "analysis-failed"; errorMessage?: string }
  | { name: "result"; outcome: AnalysisOutcome };

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const PHASE_TIMING: { status: Exclude<AnalysisStatus, "failed">; afterMs: number }[] = [
  { status: "preparing", afterMs: 0 },
  { status: "analyzing", afterMs: 1300 },
  { status: "completing", afterMs: 2700 },
];

function progressFor(stage: Stage): JourneyStep {
  switch (stage.name) {
    case "capture":
      return "photo";
    case "quality":
    case "analysis":
    case "analysis-failed":
      return "check";
    case "result":
      return "result";
  }
}

function copyForResult(outcome: Extract<Stage, { name: "result" }>["outcome"]) {
  if (outcome.kind === "result") {
    return {
      isLow: outcome.result.confidenceLevel === "low",
      isUncertain: outcome.result.predictionStatus === "uncertain",
      isHealthy: outcome.result.isHealthy === true,
    };
  }
  return { isLow: false, isUncertain: false, isHealthy: false };
}

/**
 * The core farmer journey — ONE continuous experience.
 *
 *   capture → quality check → analysis → result (success, low confidence,
 *   or a clearly-labelled edge) → retry/recovery at every branch.
 *
 * The provider is the DiagnosisService interface; today it is the live
 * AgriSmart API. The journey never imports implementation details, so the
 * provider can change without touching a single screen.
 */
export function DiagnosisJourney() {
  const [stage, setStage] = useState<Stage>({ name: "capture" });
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [captureKey, setCaptureKey] = useState(0);
  const [checking, setChecking] = useState(false);
  const [verdict, setVerdict] = useState<PhotoVerdict | null>(null);
  const [analysisPhase, setAnalysisPhase] = useState<Exclude<AnalysisStatus, "failed">>("preparing");

  const serviceRef = useRef(getDiagnosisService());
  const [serviceIsMock] = useState(() => getDiagnosisService().id === "mock");
  const imageRef = useRef<SelectedImage | null>(null);
  const qualityCheckIdRef = useRef(0);
  const analysisIdRef = useRef(0);

  useEffect(() => {
    imageRef.current = image;
  }, [image]);

  // Clear any AgriBot context this page pushed when the journey unmounts.
  useEffect(() => {
    return () => {
      analysisIdRef.current += 1;
      setAgriBotContext(null);
    };
  }, []);

  /* -------- AgriBot contextual guidance (never dominates) -------- */
  useEffect(() => {
    switch (stage.name) {
      case "capture":
        setAgriBotContext({
          id: "capture-tip",
          title: "AgriBot",
          message:
            "Try to keep the affected leaf inside the frame — close enough that the damaged area fills the picture.",
        });
        break;
      case "analysis":
        setAgriBotContext({
          id: "analysis-in-progress",
          title: "AgriBot",
          message:
            "Checking your crop now. It usually takes a few seconds — I will be here when the result is ready.",
        });
        break;
      case "analysis-failed":
        setAgriBotContext({
          id: "analysis-failed",
          title: "AgriBot",
          message:
            "Something went wrong on our side — not yours. Tap Try again with the same photo.",
        });
        break;
      case "result": {
        const outcome = stage.outcome;
        if (outcome.kind === "edge") {
          if (outcome.edge === "rejected") {
            setAgriBotContext({
              id: "result-rejected",
              title: "AgriBot",
              message:
                "The analysis was not accepted for this photo. A closer photo in softer light usually helps the model settle on an answer.",
            });
          } else {
            setAgriBotContext(null);
          }
          break;
        }
        const { isLow, isUncertain, isHealthy } = copyForResult(outcome);
        if (isUncertain) {
          setAgriBotContext({
            id: "result-uncertain",
            title: "AgriBot",
            message:
              "This photo produced a close call between a few matches. I would retake it closer and in better light before acting on any of them.",
          });
        } else if (isLow) {
          setAgriBotContext({
            id: "result-low",
            title: "AgriBot",
            message:
              "I would retake this photo closer and in better light before acting on it.",
          });
        } else if (isHealthy) {
          setAgriBotContext({
            id: "result-healthy",
            title: "AgriBot",
            message:
              "The model matched the healthy pattern here — no action needed. Keep watching for any changes in the leaves.",
          });
        } else {
          setAgriBotContext({
            id: "result-answer",
            title: "AgriBot",
            message:
              "Want me to explain what this result means? Open the What we found section below.",
            actionLabel: "Ask AgriBot",
          });
        }
        break;
      }
      default:
        setAgriBotContext(null);
    }
  }, [stage]);

  useEffect(() => {
    if (stage.name !== "quality") return;
    if (verdict === "good" || verdict === "unknown") {
      setAgriBotContext(null);
    } else if (verdict === "unsupported") {
      setAgriBotContext({
        id: "unsupported-file",
        title: "AgriBot",
        message: "That file will not analyse clearly. Choose a JPG, PNG, or WEBP photo instead.",
      });
    } else if (verdict) {
      setAgriBotContext({
        id: `poor-${verdict}`,
        title: "AgriBot",
        message:
          "I could not see the leaf clearly. Let us take another photo — closer and in better light.",
      });
    }
  }, [stage.name, verdict]);

  /* -------- capture → quality -------- */
  const runQualityCheck = useCallback((img: SelectedImage) => {
    const id = ++qualityCheckIdRef.current;
    setChecking(true);
    setVerdict(null);
    void serviceRef.current
      .checkPhoto(img)
      .then((check) => {
        if (qualityCheckIdRef.current !== id) return;
        setVerdict(check.verdict);
        setChecking(false);
      })
      .catch(() => {
        // Honest fallback: the check itself failed → say we couldn't check.
        if (qualityCheckIdRef.current !== id) return;
        setVerdict("unknown");
        setChecking(false);
      });
  }, []);

  const handleCaptureContinue = useCallback(
    (result: CaptureResult) => {
      setImage(result.image);
      setStage({ name: "quality" });
      runQualityCheck(result.image);
    },
    [runQualityCheck]
  );

  /* -------- quality → analysis -------- */
  const runAnalysis = useCallback(
    async (id: number, img: SelectedImage) => {
      const promise = serviceRef.current.analyze({ image: img, requestId: String(id) });

      for (const phase of PHASE_TIMING) {
        await wait(phase.afterMs);
        if (analysisIdRef.current !== id) return;
        setAnalysisPhase(phase.status);
      }
      await wait(1100);
      if (analysisIdRef.current !== id) return;

      let outcome: AnalysisOutcome;
      try {
        outcome = await promise;
      } catch (err) {
        if (analysisIdRef.current !== id) return;
        if (err instanceof DiagnosisServiceError) {
          // Developer diagnostics: expose error type + message.
          console.warn("[diagnosis] analysis failed:", {
            code: err.code,
            message: err.message,
          });
          setStage({ name: "analysis-failed", errorMessage: err.message });
        } else {
          console.warn("[diagnosis] analysis failed:", err);
          setStage({ name: "analysis-failed" });
        }
        return;
      }
      if (analysisIdRef.current !== id) return;
      setStage({ name: "result", outcome });
    },
    []
  );

  const startAnalysis = useCallback(
    (img: SelectedImage) => {
      const id = ++analysisIdRef.current;
      setAnalysisPhase("preparing");
      void runAnalysis(id, img);
    },
    [runAnalysis]
  );

  const handleAnalyze = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;
    setStage({ name: "analysis" });
    startAnalysis(img);
  }, [startAnalysis]);

  /* -------- recovery / restart -------- */
  const restartCapture = useCallback(() => {
    qualityCheckIdRef.current += 1;
    analysisIdRef.current += 1;
    setImage(null);
    setVerdict(null);
    setChecking(false);
    setCaptureKey((k) => k + 1);
    setStage({ name: "capture" });
  }, []);

  const scrollToRecommendation = useCallback(() => {
    document
      .getElementById("recommendation-heading")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const current = progressFor(stage);
  const resultCopy =
    stage.name === "result" ? copyForResult(stage.outcome) : { isLow: false, isUncertain: false, isHealthy: false };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <JourneyProgress current={current} className="mb-7 sm:mb-9" />

      {stage.name === "capture" && (
        <CropCapture
          key={captureKey}
          hideStepEyebrow
          onContinue={handleCaptureContinue}
        />
      )}

      {stage.name === "quality" && image && (
        <QualityCheckStage
          checking={checking}
          verdict={verdict}
          image={image}
          onAnalyze={handleAnalyze}
          onRetake={restartCapture}
          onChooseAnother={restartCapture}
          onRetryCheck={() => runQualityCheck(image)}
        />
      )}

      {stage.name === "analysis" && image && (
        <div>
          <AnalysisState
            status={analysisPhase}
            imageUrl={image.previewUrl}
            imageAlt={`${image.name} — the photo being analysed`}
            onCancel={restartCapture}
          />
          <p className="mx-auto mt-4 max-w-xl text-center text-xs text-neutral-500">
            {ANALYSIS_SERVICE_NOTE}
          </p>
        </div>
      )}

      {stage.name === "analysis-failed" && image && (
        <div>
          <AnalysisState
            status="failed"
            errorMessage={stage.errorMessage}
            imageUrl={image.previewUrl}
            imageAlt={`${image.name} — the photo from the failed analysis`}
            onRetry={() => startAnalysis(image)}
            onChooseDifferentPhoto={restartCapture}
          />
          <p className="mx-auto mt-4 max-w-xl text-center text-xs text-neutral-500">
            {ANALYSIS_SERVICE_NOTE}
          </p>
        </div>
      )}

      {stage.name === "result" && stage.outcome.kind === "result" && (
        <DiagnosisResult
          result={stage.outcome.result}
          isPrototype={serviceIsMock}
          defaultExplanationOpen={false}
          onCheckAnother={restartCapture}
          onRetake={restartCapture}
          onContinueToGuidance={
            resultCopy.isLow || resultCopy.isUncertain
              ? restartCapture
              : scrollToRecommendation
          }
        />
      )}

      {stage.name === "result" && stage.outcome.kind === "edge" && (
        <ResultEdgeState
          kind={stage.outcome.edge}
          message={stage.outcome.message}
          imageUrl={image?.previewUrl ?? null}
          imageAlt={image ? `${image.name} — the photo you submitted` : "Photo submitted for analysis"}
          onRetry={() => {
            const img = imageRef.current;
            if (img) startAnalysis(img);
          }}
          onRetake={restartCapture}
          onCheckAnother={restartCapture}
        />
      )}
    </div>
  );
}