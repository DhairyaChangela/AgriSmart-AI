"use client";

import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";

export interface ResultActionsProps {
  onCheckAnother?: () => void;
  onRetake?: () => void;
  onViewExplanation?: () => void;
  onContinueToGuidance?: () => void;
  /** Continue button label — defaults to "Continue to guidance". */
  continueLabel?: string;
  /** Hide the tertiary "View explanation" link (e.g. on edge states). */
  showExplanationAction?: boolean;
  className?: string;
}

/**
 * Clearly differentiated result actions:
 * - Primary: continue to guidance (the forward path)
 * - Secondary: check another crop / retake photo
 * - Tertiary: quiet "view explanation" anchor
 *
 * Stacked full-width on mobile, inline on larger screens.
 */
export function ResultActions({
  onCheckAnother,
  onRetake,
  onViewExplanation,
  onContinueToGuidance,
  continueLabel = "Continue to guidance",
  showExplanationAction = true,
  className,
}: ResultActionsProps) {
  return (
    <nav
      aria-label="Result actions"
      className={clsx("flex flex-col gap-3", className)}
    >
      {onContinueToGuidance && (
        <Button
          type="button"
          size="lg"
          fullWidth
          onClick={onContinueToGuidance}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          }
          iconPosition="right"
        >
          {continueLabel}
        </Button>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {onCheckAnother && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onCheckAnother}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Check another crop
          </Button>
        )}
        {onRetake && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={onRetake}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8m0-5v5h5" />
              </svg>
            }
          >
            Retake photo
          </Button>
        )}
      </div>

      {showExplanationAction && onViewExplanation && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onViewExplanation}
          >
            View explanation
          </Button>
        </div>
      )}
    </nav>
  );
}
