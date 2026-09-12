"use client";

import Image from "next/image";
import { clsx } from "clsx";
import { ImageQualityState } from "@/components/camera";
import type { SelectedImage } from "@/components/camera";
import { Button } from "@/components/ui/Button";
import type { PhotoVerdict } from "@/lib/diagnosis";

export interface QualityCheckStageProps {
  /** True while the provider is validating the photo. */
  checking: boolean;
  /** Verdict from the provider. null while checking. */
  verdict: PhotoVerdict | null;
  image: SelectedImage;
  onAnalyze: () => void;
  onRetake: () => void;
  onChooseAnother: () => void;
  onRetryCheck: () => void;
  className?: string;
}

const WARNING_VERDICTS: PhotoVerdict[] = [
  "blurry",
  "too-dark",
  "too-bright",
  "leaf-not-clear",
];

function isWarning(verdict: PhotoVerdict): boolean {
  return WARNING_VERDICTS.includes(verdict);
}

/**
 * Pre-analysis validation stage: a calm "Checking your photo…" gate,
 * then a clear verdict with an obvious next action for every outcome.
 *
 * Presentational only — the verdict comes from the parent via the
 * DiagnosisService. Nothing here decides image quality.
 */
export function QualityCheckStage({
  checking,
  verdict,
  image,
  onAnalyze,
  onRetake,
  onChooseAnother,
  onRetryCheck,
  className,
}: QualityCheckStageProps) {
  return (
    <div className={clsx("mx-auto w-full max-w-xl", className)}>
      <div aria-live="polite" className="sr-only">
        {checking ? "Checking your photo." : verdict ? `Photo check: ${verdict}` : ""}
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-700">
          Photo check
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {checking ? "Checking your photo" : "How did the photo look?"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-base text-neutral-600">
          {checking
            ? "Looking at light, focus, and whether the leaf fills the frame."
            : "One quick check before the analysis."}
        </p>
      </div>

      {/* The submitted photo, kept in view while it is checked. */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="relative aspect-[4/3] w-full bg-neutral-100">
          <Image
            src={image.previewUrl}
            alt={`${image.name} — the leaf photo you submitted`}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-contain"
            unoptimized
          />
          {checking && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm" role="status">
              <svg className="h-8 w-8 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-medium text-neutral-700">Checking your photo…</p>
            </div>
          )}
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {checking ? (
            <div role="status" aria-live="polite">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full w-1/3 rounded-full bg-primary-500 motion-safe:animate-[quality-slide_1.2s_ease-in-out_infinite]" />
              </div>
              <p className="mt-3 text-sm text-neutral-600">
                This only takes a moment — your photo stays on your device.
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Checking the photo format locally before analysis.
              </p>
            </div>
          ) : (
            <>
              {verdict && <ImageQualityState state={verdict} />}

              {verdict === "good" && (
                <div className="flex flex-col gap-3">
                  <Button type="button" size="lg" fullWidth onClick={onAnalyze} icon={IconArrowRight} iconPosition="right">
                    Check this leaf
                  </Button>
                  <p className="text-center text-xs text-neutral-500">
                    The photo passes the check. The analysis looks at the visible
                    signs next.
                  </p>
                </div>
              )}

              {verdict && isWarning(verdict) && (
                <div className="flex flex-col gap-3">
                  <Button type="button" size="lg" fullWidth onClick={onRetake}>
                    Retake photo
                  </Button>
                  <Button type="button" variant="outline" size="lg" fullWidth onClick={onChooseAnother}>
                    Use another image
                  </Button>
                  <button
                    type="button"
                    onClick={onAnalyze}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-lg px-3 text-sm font-medium text-neutral-600 underline underline-offset-2 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                  >
                    Use this photo anyway
                  </button>
                </div>
              )}

              {verdict === "unsupported" && (
                <div className="flex flex-col gap-3">
                  <Button type="button" size="lg" fullWidth onClick={onChooseAnother}>
                    Choose another image
                  </Button>
                  <Button type="button" variant="outline" size="lg" fullWidth onClick={onRetryCheck}>
                    Try checking again
                  </Button>
                </div>
              )}

              {verdict === "unknown" && (
                <div className="flex flex-col gap-3">
                  <Button type="button" size="lg" fullWidth onClick={onAnalyze}>
                    Check this photo anyway
                  </Button>
                  <Button type="button" variant="outline" size="lg" fullWidth onClick={onRetake}>
                    Retake photo
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!checking && (
        <div className="mt-4 rounded-xl bg-neutral-100 px-4 py-2.5 text-xs leading-relaxed text-neutral-500">
          This photo check runs on your device before analysis. The diagnosis
          itself comes from the live AgriSmart model.
        </div>
      )}

      <style>{`
        @keyframes quality-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

const IconArrowRight = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);