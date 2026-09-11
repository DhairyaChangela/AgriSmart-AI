"use client";

import Image from "next/image";
import { clsx } from "clsx";
import type { ImageQualityKind, SelectedImage } from "./types";
import { formatFileSize } from "./validation";
import { ImageQualityState } from "./ImageQualityState";

export interface ImagePreviewProps {
  image: SelectedImage;
  quality: ImageQualityKind;
  loading?: boolean;
  uploadFailed?: boolean;
  onRemove: () => void;
  onReplace: () => void;
  onRetry?: () => void;
  onContinue: () => void;
}

/**
 * Preview + remove / replace / continue actions.
 * "Continue" only signals readiness — it never runs analysis.
 */
export function ImagePreview({
  image,
  quality,
  loading = false,
  uploadFailed = false,
  onRemove,
  onReplace,
  onRetry,
  onContinue,
}: ImagePreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="relative aspect-[4/3] w-full bg-neutral-100">
        <Image
          src={image.previewUrl}
          alt={`Preview of ${image.name} — a leaf photo you selected`}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-contain"
          unoptimized
          priority={false}
        />
        {loading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm"
            role="status"
            aria-label="Reading your photo"
          >
            <svg className="h-8 w-8 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm font-medium text-neutral-700">Reading your photo…</p>
            <span className="sr-only">Preparing your photo preview</span>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900" title={image.name}>
              {image.name}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              {formatFileSize(image.sizeBytes)} · ready on your phone
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700">
            Selected
          </span>
        </div>

        <ImageQualityState state={quality} compact />

        {uploadFailed && (
          <div role="alert" className="rounded-xl border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">
            <p className="font-semibold">Something went wrong reading this photo.</p>
            <p className="mt-1">Your photo was not sent anywhere. Please try again.</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 inline-flex min-h-[44px] items-center rounded-lg px-3 font-medium text-error-700 underline underline-offset-2 hover:text-error-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500 focus-visible:ring-offset-2"
              >
                Try reading it again
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onContinue}
          disabled={loading}
          data-pointer-accent
          className={clsx(
            "inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 text-base font-semibold text-white shadow-sm transition-colors",
            "hover:bg-primary-700",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          Continue to analysis
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onReplace}
            disabled={loading}
            className={clsx(
              "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-primary-300 bg-white px-3 text-sm font-semibold text-primary-800 transition-colors",
              "hover:bg-primary-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            Replace
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={loading}
            className={clsx(
              "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-600 transition-colors",
              "hover:bg-neutral-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            Remove
          </button>
        </div>

        <p className="text-center text-xs text-neutral-500">
          Analysis on the next screen uses sample content until the live model is connected.
        </p>
      </div>
    </div>
  );
}
