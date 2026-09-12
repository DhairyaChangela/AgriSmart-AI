"use client";

import { clsx } from "clsx";

export type JourneyStep = "photo" | "check" | "result";

const STEPS: { key: JourneyStep; label: string }[] = [
  { key: "photo", label: "Photo" },
  { key: "check", label: "Check" },
  { key: "result", label: "Result" },
];

const ORDER: JourneyStep[] = ["photo", "check", "result"];

export interface JourneyProgressProps {
  current: JourneyStep;
  className?: string;
}

/**
 * Macro journey progress (Photo → Check → Result), owned by the
 * DiagnosisJourney. The capture sub-flow keeps its own Choose/Capture/
 * Review dots; these are the product-level steps.
 */
export function JourneyProgress({ current, className }: JourneyProgressProps) {
  const activeIndex = Math.max(0, ORDER.indexOf(current));

  return (
    <nav aria-label="Diagnosis progress" className={clsx("relative mx-auto w-full max-w-sm", className)}>
      <ol className="flex w-full items-center justify-between" role="list">
        {STEPS.map((step, i) => {
          const isActive = i === activeIndex;
          const isDone = i < activeIndex;
          return (
            <li key={step.key} className="flex flex-col items-center">
              <span
                aria-current={isActive ? "step" : undefined}
                className={clsx(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                  isActive
                    ? "border-primary-600 bg-primary-600 text-white"
                    : isDone
                      ? "border-success-500 bg-success-500 text-white"
                      : "border-neutral-300 bg-white text-neutral-400"
                )}
              >
                {isDone ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold">{i + 1}</span>
                )}
              </span>
              <span
                className={clsx(
                  "mt-1.5 text-xs font-medium",
                  isActive ? "text-primary-700" : "text-neutral-500"
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
      <div aria-hidden="true" className="absolute left-12 right-12 top-[18px] flex items-center">
        <div className={clsx("h-px flex-1 transition-colors", activeIndex > 0 ? "bg-primary-400" : "bg-neutral-200")} />
      </div>
      <p className="sr-only" role="status">
        Step {activeIndex + 1} of {STEPS.length}: {STEPS[activeIndex].label}
      </p>
    </nav>
  );
}