"use client";

import { clsx } from "clsx";
import { AgriBotAvatar } from "./AgriBotAvatar";
import type { AgriBotState } from "./AgriBotState";
import { useEntered } from "./useEntered";

export interface AgriBotBubbleAction {
  id: string;
  label: string;
  primary?: boolean;
}

interface AgriBotBubbleProps {
  visible?: boolean;
  state: AgriBotState;
  title: string;
  message: string;
  actions?: AgriBotBubbleAction[];
  onAction: (id: string) => void;
  onClose: () => void;
}

export function AgriBotBubble({
  visible = true,
  state,
  title,
  message,
  actions = [],
  onAction,
  onClose,
}: AgriBotBubbleProps) {
  const entered = useEntered();
  const shown = visible && entered;

  return (
    <div
      className={clsx(
        "absolute right-0 bottom-full mb-3 w-[min(20rem,calc(100vw-2.5rem))]",
        "transition-all duration-300 ease-out",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="relative rounded-2xl rounded-br-md bg-white border border-neutral-200 shadow-xl">
        <div className="flex items-start gap-2.5 px-3.5 pt-3.5 pb-3">
          <AgriBotAvatar state={state} size="sm" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-body-sm font-semibold text-neutral-900">{title}</p>
              <button
                type="button"
                className="shrink-0 flex h-11 w-11 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1"
                onClick={onClose}
                aria-label="Dismiss message"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-0.5 text-body-sm text-neutral-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3.5 pb-3.5">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onAction(action.id)}
                className={clsx(
                  "inline-flex items-center rounded-lg px-3 py-1.5 text-body-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1",
                  action.primary
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="absolute right-4 -bottom-1.5 h-3 w-3 rotate-45 border-b border-r border-neutral-200 bg-white" aria-hidden="true" />
    </div>
  );
}
