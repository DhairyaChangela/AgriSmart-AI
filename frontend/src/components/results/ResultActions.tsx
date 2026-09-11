"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { getButtonClassName } from "@/lib/utils/buttonStyles";

export interface ResultActionsProps {
  onRetry?: () => void;
  className?: string;
}

export function ResultActions({ onRetry, className }: ResultActionsProps) {
  return (
    <div className={clsx("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <Link href="/check-crop" className={getButtonClassName({ size: "lg", fullWidth: true, className: "sm:w-auto" })}>
        Retake photo
      </Link>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={getButtonClassName({ variant: "outline", size: "lg", fullWidth: true, className: "sm:w-auto" })}
        >
          Retry analysis
        </button>
      )}
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
      >
        Back to home
      </Link>
    </div>
  );
}
