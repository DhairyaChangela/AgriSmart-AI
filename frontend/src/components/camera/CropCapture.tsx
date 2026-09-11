"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { CaptureResult, CaptureStep, ImageQualityKind, SelectedImage } from "./types";
import {
  ACCEPT_ATTRIBUTE,
  createPreviewUrl,
  revokePreviewUrl,
  validateImageFile,
} from "./validation";
import { UploadDropzone } from "./UploadDropzone";
import { ImagePreview } from "./ImagePreview";
import { ImageGuidance } from "./ImageGuidance";

export interface CropCaptureProps {
  /** Called when the farmer taps "Continue with this photo". No analysis happens here. */
  onContinue?: (result: CaptureResult) => void;
  className?: string;
}

type CameraStatus = "idle" | "requesting" | "live" | "denied" | "unavailable";

function StepBackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}

export function CropCapture({ onContinue, className }: CropCaptureProps) {
  const [step, setStep] = useState<CaptureStep>("choose");
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [quality] = useState<ImageQualityKind>("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [continued, setContinued] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {
        /* best-effort */
      }
    });
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
    };
  }, [stopCamera]);

  const clearImage = useCallback(() => {
    setImage((prev) => {
      if (prev) revokePreviewUrl(prev.previewUrl);
      return null;
    });
  }, []);

  const acceptFile = useCallback(
    (file: File) => {
      setError(null);
      setUploadFailed(false);
      setContinued(false);

      const validation = validateImageFile(file);
      if (!validation.ok) {
        setError(validation.message ?? "Please choose a different photo.");
        return;
      }

      setLoading(true);
      // Brief local "reading" state so the loading UI is perceivable.
      // No network, no analysis — just creating a local preview.
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
      loadingTimer.current = setTimeout(() => {
        try {
          const previewUrl = createPreviewUrl(file);
          clearImage();
          setImage({ file, previewUrl, name: file.name || "leaf-photo", sizeBytes: file.size, type: file.type });
          setStep("review");
        } catch {
          setUploadFailed(true);
          setError("Something went wrong reading this photo. Your photo was not sent anywhere. Please try again.");
          setStep("upload");
        } finally {
          setLoading(false);
        }
      }, 500);
    },
    [clearImage]
  );

  const startCamera = useCallback(async () => {
    setCameraStatus("requesting");
    setCameraError(null);
    stopCamera();

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("unavailable");
      setCameraError("Live camera isn't available in this browser. You can still take a photo with your camera app.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraStatus("live");
      // Attach on next tick so <video> is mounted.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
            /* autoplay with muted+playsInline rarely rejects; ignore */
          });
        }
      });
    } catch (err) {
      stopCamera();
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setCameraStatus("denied");
        setCameraError("Camera access was blocked. You can allow it in your browser settings — or use your camera app instead.");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setCameraStatus("unavailable");
        setCameraError("We couldn't find a camera on this device. You can still upload a photo instead.");
      } else {
        setCameraStatus("unavailable");
        setCameraError("The camera isn't working right now. You can still take a photo with your camera app.");
      }
    }
  }, [stopCamera]);

  const goToCamera = useCallback(() => {
    setError(null);
    setStep("camera");
    void startCamera();
  }, [startCamera]);

  const goToUpload = useCallback(() => {
    stopCamera();
    setCameraStatus("idle");
    setError(null);
    setStep("upload");
  }, [stopCamera]);

  const goToChoose = useCallback(() => {
    stopCamera();
    setCameraStatus("idle");
    setError(null);
    setStep("choose");
  }, [stopCamera]);

  const captureFromVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || cameraStatus !== "live") return;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    if (width === 0 || height === 0) {
      setCameraError("The camera isn't ready yet. Hold steady and try again in a moment.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCameraError("We couldn't capture that frame. Please try again.");
      return;
    }
    ctx.drawImage(video, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("We couldn't capture that frame. Please try again.");
          return;
        }
        stopCamera();
        setCameraStatus("idle");
        acceptFile(new File([blob], `leaf-photo-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  }, [acceptFile, cameraStatus, stopCamera]);

  const handleRemove = useCallback(() => {
    clearImage();
    setUploadFailed(false);
    setContinued(false);
    setError(null);
    setStep("upload");
  }, [clearImage]);

  const handleContinue = useCallback(() => {
    if (!image || loading) return;
    setContinued(true);
    onContinue?.({ image });
  }, [image, loading, onContinue]);

  return (
    <div className={clsx("mx-auto w-full max-w-xl", className)}>
      <div aria-live="polite" className="sr-only">
        {loading ? "Reading your photo." : error ? error : continued ? "Photo ready for the next step." : ""}
      </div>

      {step === "choose" && (
        <div className="space-y-5">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-700">
              Step 1 of 2 · Add a photo
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Show us your crop
            </h1>
            <p className="mx-auto mt-2 max-w-md text-base text-neutral-600">
              One photo. One clear answer. One clear next action.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-1">
            <button
              type="button"
              onClick={goToCamera}
              className="flex min-h-[76px] w-full items-center gap-4 rounded-2xl bg-primary-600 px-5 py-4 text-left text-white shadow-primary transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold leading-tight">Take a photo</span>
                <span className="mt-0.5 block text-sm text-white/85">
                  Point at one leaf — fastest option
                </span>
              </span>
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goToUpload}
              className="flex min-h-[76px] w-full items-center gap-4 rounded-2xl border-2 border-neutral-300 bg-white px-5 py-4 text-left text-neutral-900 transition-colors hover:border-primary-400 hover:bg-primary-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold leading-tight">Upload photo</span>
                <span className="mt-0.5 block text-sm text-neutral-600">
                  Choose a photo already on your phone
                </span>
              </span>
              <svg className="h-5 w-5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <ImageGuidance compact />
        </div>
      )}

      {step === "camera" && (
        <div className="space-y-4">
          <StepBackButton onClick={goToChoose} label="Back to choices" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Take a photo</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Center one leaf in the frame. These are photo tips — the app is not judging your
              camera view.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950">
            {cameraStatus === "live" || cameraStatus === "requesting" ? (
              <div className="relative aspect-[3/4] w-full bg-neutral-900 sm:aspect-[4/3]">
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  autoPlay
                  aria-label="Live camera view. Center the leaf inside the frame outline."
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Static framing overlay — decorative, not a detection box */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
                  <div className="h-full max-h-[80%] w-full max-w-[80%] rounded-2xl border-2 border-dashed border-white/80" />
                </div>
                {cameraStatus === "requesting" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/60" role="status">
                    <p className="rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-800">
                      Starting camera…
                    </p>
                  </div>
                )}
                <p className="absolute inset-x-0 top-3 mx-auto w-fit rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                  Photo tips only — no automatic check
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-white">
                  {cameraStatus === "denied" ? "Camera is blocked" : "Camera isn't available"}
                </h2>
                <p className="max-w-sm text-sm text-white/80">
                  {cameraError ?? "You can still take a photo with your camera app and upload it."}
                </p>
                <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => void startCamera()}
                    className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-white px-5 text-base font-semibold text-neutral-900 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                  >
                    Try camera again
                  </button>
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-white/30 px-5 text-base font-medium text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                  >
                    Use camera app instead
                  </button>
                </div>
                <button
                  type="button"
                  onClick={goToUpload}
                  className="mt-1 inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-white/85 underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  Or upload a photo from your phone
                </button>
              </div>
            )}
          </div>

          {cameraError && cameraStatus === "live" && (
            <p role="alert" className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700">
              {cameraError}
            </p>
          )}

          {(cameraStatus === "live" || cameraStatus === "requesting") && (
            <div className="grid gap-3">
              <button
                type="button"
                onClick={captureFromVideo}
                disabled={cameraStatus !== "live"}
                className="inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 text-lg font-semibold text-white shadow-primary transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white">
                  <span className="h-5 w-5 rounded-full bg-white" />
                </span>
                Capture photo
              </button>
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl border-2 border-neutral-300 bg-white px-4 text-base font-medium text-neutral-700 hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                Use camera app instead
              </button>
            </div>
          )}

          <ul aria-label="Quick photo reminders" className="flex flex-wrap gap-2">
            {["Move closer", "Keep leaf centered", "Hold steady", "Include the damaged area"].map((tip) => (
              <li key={tip} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
                {tip}
              </li>
            ))}
          </ul>

          <ImageGuidance compact />

          {/* Native camera fallback: opens the OS camera app on mobile */}
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            capture="environment"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) acceptFile(file);
            }}
          />
        </div>
      )}

      {step === "upload" && (
        <div className="space-y-4">
          <StepBackButton onClick={image ? () => setStep("review") : goToChoose} label={image ? "Back to preview" : "Back to choices"} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Upload a photo</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Choose one clear photo of the affected leaf. It stays on your phone.
            </p>
          </div>

          <UploadDropzone onFileChosen={acceptFile} loading={loading} error={error} />

          {loading && (
            <div role="status" className="rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">
              Reading your photo… this only takes a moment.
            </div>
          )}

          <ImageGuidance compact />
        </div>
      )}

      {step === "review" && image && (
        <div className="space-y-4">
          <StepBackButton onClick={goToChoose} label="Start over" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Check your photo</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Does the leaf look clear and bright? If not, replace it — a better photo helps later.
            </p>
          </div>

          <ImagePreview
            image={image}
            quality={quality}
            loading={loading}
            uploadFailed={uploadFailed}
            onRemove={handleRemove}
            onReplace={() => replaceInputRef.current?.click()}
            onRetry={() => image && acceptFile(image.file)}
            onContinue={handleContinue}
          />

          <input
            ref={replaceInputRef}
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            aria-label="Replace photo"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) acceptFile(file);
            }}
          />

          {continued && (
            <div role="status" className="rounded-2xl border border-success-100 bg-success-50 px-4 py-4">
              <p className="font-semibold text-success-700">Photo ready for the next step.</p>
              <p className="mt-1 text-sm text-neutral-600">
                Nothing has been diagnosed — this photo will be used when you continue.
              </p>
            </div>
          )}

          <ImageGuidance compact />
        </div>
      )}

      {step === "review" && !image && (
        <div className="space-y-4">
          <p role="alert" className="rounded-xl border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">
            Your photo was removed. Please choose a photo to continue.
          </p>
          <UploadDropzone onFileChosen={acceptFile} loading={loading} error={error} />
        </div>
      )}
    </div>
  );
}
