"use client";

import { forwardRef, HTMLAttributes } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { getButtonClassName } from "@/lib/utils/buttonStyles";
import { AgriBotAvatar } from "./AgriBotAvatar";
import { useEntered } from "./useEntered";
import {
  AGRIBOT_HELP_HEADING,
  AGRIBOT_HELP_MESSAGE,
  AGRIBOT_STATUS,
  AGRIBOT_TOPICS,
  type AgriBotState,
  type AgriBotTopic,
} from "./AgriBotState";

export type AgriBotFollowUpId = "helpful" | "not-quite" | "topics" | "check-crop";

interface AgriBotPanelProps extends HTMLAttributes<HTMLDivElement> {
  state: AgriBotState;
  activeTopic: AgriBotTopic | null;
  onClose: () => void;
  onPickTopic: (topic: AgriBotTopic) => void;
  onFollowUp: (id: AgriBotFollowUpId) => void;
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1"
      onClick={onClick}
      aria-label="Close AgriBot assistant"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

export const AgriBotPanel = forwardRef<HTMLDivElement, AgriBotPanelProps>(
  ({ state, activeTopic, onClose, onPickTopic, onFollowUp, className, ...props }, ref) => {
    const status = AGRIBOT_STATUS[state];
    const isBusy = state === "thinking" || state === "loading";
    const entered = useEntered();

    return (
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="false"
        aria-label="AgriBot assistant"
        aria-busy={isBusy}
className={clsx(
          "absolute right-0 bottom-24 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-hidden",
          "rounded-2xl bg-white border border-neutral-200 shadow-2xl",
          "transition-all duration-300 ease-out",
          "max-h-[min(70vh,32rem)]",
          entered ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-3 scale-95 pointer-events-none",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5 border-b border-neutral-100 px-4 py-3">
          <AgriBotAvatar state={state} size="sm" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-body-sm font-semibold leading-tight text-neutral-900">AgriBot</p>
            <p className="text-xs text-neutral-500 leading-tight">AgriSmart AI guide</p>
          </div>
          <span className={clsx("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", status.className)}>
            {status.label}
          </span>
          <CloseButton onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite" aria-atomic="true">
          {activeTopic === null ? (
            <div className="space-y-4">
              <AgriBotAvatar state={state} size="md" />
              <div>
                <h2 className="text-h4 text-neutral-900">{AGRIBOT_HELP_HEADING}</h2>
                <p className="mt-1 text-body-sm text-neutral-600 leading-relaxed">{AGRIBOT_HELP_MESSAGE}</p>
              </div>
              <nav className="space-y-2" aria-label="Suggested questions">
                {AGRIBOT_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => onPickTopic(topic)}
                    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1"
                  >
                    <span className="text-body-sm font-medium text-neutral-800">{topic.question}</span>
                    <svg
                      className="h-4 w-4 shrink-0 text-neutral-400 transition-colors group-hover:text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </nav>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <AgriBotAvatar state={state} size="sm" className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div
                    className={clsx(
                      "rounded-2xl rounded-tl-md px-3.5 py-3 text-body-sm leading-relaxed text-neutral-800",
                      isBusy ? "bg-neutral-100" : "bg-neutral-100"
                    )}
                  >
                    {isBusy ? (
                      <span className="flex items-center gap-2 text-neutral-500">
                        <ThinkingDots />
                        <span className="sr-only">AgriBot is thinking</span>
                        <span>One moment</span>
                      </span>
                    ) : (
                      <p>{activeTopic.answer}</p>
                    )}
                  </div>

                  {activeTopic.note && !isBusy && state !== "confused" && (
                    <div className="flex items-start gap-2 rounded-xl border border-warning-100 bg-warning-50 px-3 py-2.5">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-warning-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <p className="text-body-sm text-warning-800">{activeTopic.note}</p>
                    </div>
                  )}

                  {state === "explaining" && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onFollowUp("helpful")}
                        className="inline-flex items-center rounded-lg bg-primary-600 px-3 py-1.5 text-body-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-1"
                      >
                        That helps
                      </button>
                      <button
                        type="button"
                        onClick={() => onFollowUp("not-quite")}
                        className="inline-flex items-center rounded-lg bg-neutral-100 px-3 py-1.5 text-body-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
                      >
                        Not quite
                      </button>
                      <button
                        type="button"
                        onClick={() => onFollowUp("topics")}
                        className="inline-flex items-center rounded-lg px-3 py-1.5 text-body-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
                      >
                        Back to topics
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {(state === "success" || state === "confused") && (
                <div className="space-y-4 rounded-2xl bg-neutral-50 p-4">
                  {state === "success" ? (
                    <>
                      <p className="text-h4 text-neutral-900">Happy to help.</p>
                      <p className="text-body-sm text-neutral-600 leading-relaxed">
                        Whenever you are ready, open Check Crop and we can look at a real leaf together.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-h4 text-neutral-900">Let me re-check.</p>
                      <p className="text-body-sm text-neutral-600 leading-relaxed">
                        Want me to walk you through it again, or back up to the starting topics?
                      </p>
                    </>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/check-crop"
                      className={getButtonClassName({ size: "sm" })}
                    >
                      Go to Check Crop
                    </Link>
                    <button
                      type="button"
                      onClick={() => onFollowUp("topics")}
                      className="inline-flex items-center rounded-lg bg-neutral-100 px-3 py-1.5 text-body-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
                    >
                      Show topics
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-2.5">
          <p className="text-xs text-neutral-500" role="note">
            Sample guide content. The live crop diagnosis model is not connected yet.
          </p>
        </div>
      </div>
    );
  }
);

AgriBotPanel.displayName = "AgriBotPanel";