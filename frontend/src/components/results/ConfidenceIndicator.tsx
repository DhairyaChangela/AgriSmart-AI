"use client";

import { clsx } from "clsx";
import type { ConfidenceLevel } from "./types";

const COPY: Record<
  ConfidenceLevel,
  { label: string; detail: string; tone: "success" | "warning" | "neutral" }
> = {
  high: {
    label: "High confidence",
    detail: "The visible pattern is fairly clear — still verify in the field before major action.",
    tone: "success",
  },
  moderate: {
    label: "Moderate confidence",
    detail: "Possible match — treat as guidance and consider a clearer photo or expert review.",
    tone: "warning",
  },
  low: {
    label: "Low confidence",
    detail: "Not enough detail for a reliable label — retake the photo or ask an expert.",
    tone: "neutral",
  },
};

const toneClass = {
  success: "border-success-200 bg-success-50 text-success-900",
  warning: "border-warning-200 bg-warning-50 text-warning-900",
  neutral: "border-neutral-200 bg-neutral-50 text-neutral-800",
};

export interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  className?: string;
}

export function ConfidenceIndicator({ level, className }: ConfidenceIndicatorProps) {
  const copy = COPY[level];
  const bars = level === "high" ? 3 : level === "moderate" ? 2 : 1;

  return (
    <div className={clsx("rounded-xl border px-4 py-3", toneClass[copy.tone], className)} role="status">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-semibold">{copy.label}</p>
        <div className="flex items-end gap-1" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={clsx(
                "w-2 rounded-sm",
                i <= bars ? "bg-primary-600" : "bg-neutral-300/80",
                i === 1 ? "h-2" : i === 2 ? "h-3" : "h-4"
              )}
            />
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed opacity-90">{copy.detail}</p>
    </div>
  );
}
