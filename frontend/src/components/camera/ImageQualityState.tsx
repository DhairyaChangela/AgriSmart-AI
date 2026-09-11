"use client";

import { clsx } from "clsx";
import type { ImageQualityKind } from "./types";

interface QualityCopy {
  title: string;
  message: string;
  badge: string;
  tone: "success" | "warning" | "error" | "info" | "default";
  icon: React.ReactNode;
}

/**
 * Reusable UI for photo-quality states.
 *
 * PRESENTATIONAL ONLY — this component never assesses an image.
 * The parent decides which state to show. By default the capture
 * flow shows "unknown" (honest: we haven't checked anything).
 */
export const IMAGE_QUALITY_COPY: Record<ImageQualityKind, Omit<QualityCopy, "icon">> = {
  good: {
    title: "This photo looks good.",
    message: "Clear and bright — you can continue.",
    badge: "Good photo",
    tone: "success",
  },
  blurry: {
    title: "This photo looks a little blurry.",
    message: "Try holding your phone steady and tap the leaf to focus.",
    badge: "Blurry",
    tone: "warning",
  },
  "too-dark": {
    title: "Your photo looks a little dark.",
    message: "Try moving into better light, out of shadow.",
    badge: "Too dark",
    tone: "warning",
  },
  "too-bright": {
    title: "This photo looks too bright.",
    message: "Try moving out of direct sunlight so the leaf isn't washed out.",
    badge: "Too bright",
    tone: "warning",
  },
  "leaf-not-clear": {
    title: "We can't see the leaf clearly.",
    message: "Move closer to the leaf and keep the affected area in the frame.",
    badge: "Leaf not clear",
    tone: "warning",
  },
  unsupported: {
    title: "We can't use this file.",
    message: "Please choose a JPG, PNG, or WEBP photo.",
    badge: "Unsupported",
    tone: "error",
  },
  unknown: {
    title: "We haven't checked this photo.",
    message: "Compare it with the photo tips below. You can still continue.",
    badge: "Not checked",
    tone: "default",
  },
};

function QualityIcon({ kind }: { kind: ImageQualityKind }) {
  const common = "h-5 w-5 shrink-0";
  if (kind === "good") {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (kind === "unknown") {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

const toneStyles: Record<QualityCopy["tone"], string> = {
  success: "bg-success-50 border-success-100 text-success-700",
  warning: "bg-warning-50 border-warning-100 text-warning-700",
  error: "bg-error-50 border-error-100 text-error-700",
  info: "bg-info-50 border-info-100 text-info-700",
  default: "bg-neutral-50 border-neutral-200 text-neutral-700",
};

const badgeToneStyles: Record<QualityCopy["tone"], string> = {
  success: "bg-success-500/10 text-success-700",
  warning: "bg-warning-500/10 text-warning-700",
  error: "bg-error-500/10 text-error-700",
  info: "bg-info-500/10 text-info-700",
  default: "bg-neutral-500/10 text-neutral-600",
};

export interface ImageQualityStateProps {
  state: ImageQualityKind;
  compact?: boolean;
  className?: string;
}

export function ImageQualityState({ state, compact = false, className }: ImageQualityStateProps) {
  const copy = IMAGE_QUALITY_COPY[state];

  return (
    <div
      role="status"
      aria-label={`Photo check: ${copy.badge}`}
      className={clsx(
        "flex items-start gap-3 rounded-xl border px-4",
        compact ? "py-3" : "py-4",
        toneStyles[copy.tone],
        className
      )}
    >
      <span aria-hidden="true" className="mt-0.5">
        <QualityIcon kind={state} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={clsx("font-semibold text-neutral-900", compact ? "text-sm" : "text-base")}>
            {copy.title}
          </p>
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              badgeToneStyles[copy.tone]
            )}
          >
            {copy.badge}
          </span>
        </div>
        <p className={clsx("mt-1 text-neutral-600", compact ? "text-sm" : "text-body-sm")}>
          {copy.message}
        </p>
        {!compact && state === "unknown" && (
          <p className="mt-2 text-xs text-neutral-500">
            Tip: this is not an automatic check — use the photo guide to judge your image.
          </p>
        )}
      </div>
    </div>
  );
}
