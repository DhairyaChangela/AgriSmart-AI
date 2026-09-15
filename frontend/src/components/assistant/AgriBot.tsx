"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { clsx } from "clsx";
import { AgriBotAvatar } from "./AgriBotAvatar";
import { AgriBotBubble } from "./AgriBotBubble";
import { AgriBotPanel, type AgriBotFollowUpId } from "./AgriBotPanel";
import {
  AGRIBOT_TOPICS,
  AGRIBOT_WELCOME_MESSAGE,
  AGRIBOT_WELCOME_TITLE,
  type AgriBotState,
  type AgriBotTopic,
} from "./AgriBotState";
import {
  subscribeAgriBotContext,
  getAgriBotContext,
  type AgriBotContextMessage,
} from "@/lib/assistant/agribotContext";

interface AgriBotProps {
  className?: string;
}

export function AgriBot({ className }: AgriBotProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AgriBotState>("welcome");
  const [activeTopic, setActiveTopic] = useState<AgriBotTopic | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [contextMsg, setContextMsg] = useState<AgriBotContextMessage | null>(() =>
    getAgriBotContext()
  );
  // Which contextual bubble was dismissed. A fresh id re-shows automatically.
  const [dismissedContextId, setDismissedContextId] = useState<string | null>(null);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timerIdsRef = useRef<number[]>([]);
  const hasOpenedRef = useRef(false);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timerIdsRef.current.push(id);
    return id;
  }, []);

  const clearScheduled = useCallback((id: number) => {
    window.clearTimeout(id);
    const index = timerIdsRef.current.indexOf(id);
    if (index !== -1) timerIdsRef.current.splice(index, 1);
  }, []);

  const openPanel = useCallback(() => {
    hasOpenedRef.current = true;
    setShowBubble(false);
    if (contextMsg) setDismissedContextId(contextMsg.id);
    setOpen(true);
  }, [contextMsg]);

  const closePanel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleContextChange = useCallback((msg: AgriBotContextMessage | null) => {
    setContextMsg(msg);
    // A cleared store (journey finished) also un-dismisses the last bubble,
    // so a brand-new journey can reintroduce its tip cleanly.
    if (!msg) setDismissedContextId(null);
  }, []);

  useEffect(() => subscribeAgriBotContext(handleContextChange), [handleContextChange]);

  // Derived, not state: contextual bubbles appear immediately (no 1.4s
  // welcome delay) and a fresh id re-shows a previously dismissed bubble.
  const showContextBubble = contextMsg !== null && dismissedContextId !== contextMsg.id;

useEffect(() => {
    if (open) {
      const id = schedule(() => panelRef.current?.focus(), 160);
      return () => clearScheduled(id);
    } else {
      launcherRef.current?.focus();
    }
  }, [open, schedule, clearScheduled]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        return;
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || launcherRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    const pendingTimers = timerIdsRef.current;
    return () => {
      pendingTimers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const pickTopic = useCallback(
    (topic: AgriBotTopic) => {
      setShowBubble(false);
      hasOpenedRef.current = true;
      setActiveTopic(topic);
      setState("thinking");
      setOpen(true);
      schedule(() => setState("explaining"), 900);
    },
    [schedule]
  );

  const handleFollowUp = useCallback((id: AgriBotFollowUpId) => {
    if (id === "topics") {
      setState("welcome");
      setActiveTopic(null);
    } else if (id === "helpful") {
      setState("success");
    } else if (id === "not-quite") {
      setState("confused");
    }
  }, []);

  const handleBubbleAction = useCallback(
    (id: string) => {
      setShowBubble(false);
      if (contextMsg) setDismissedContextId(contextMsg.id);
      if (id === "open") {
        openPanel();
      }
    },
    [contextMsg, openPanel]
  );

  const handleToggle = useCallback(() => {
    if (open) {
      closePanel();
    } else {
      openPanel();
    }
  }, [open, closePanel, openPanel]);

  return (
    <div className={clsx("fixed right-3 bottom-3 z-[300] sm:right-5 sm:bottom-5", className)}>
      {showBubble && !contextMsg && !open && (
        <AgriBotBubble
          state="welcome"
          title={AGRIBOT_WELCOME_TITLE}
          message={AGRIBOT_WELCOME_MESSAGE}
          actions={[
            { id: "open", label: "Show me the options", primary: true },
            { id: "dismiss", label: "Got it" },
          ]}
          onAction={handleBubbleAction}
          onClose={() => {
            setShowBubble(false);
          }}
        />
      )}

      {showContextBubble && contextMsg && !open && (
        <AgriBotBubble
          state="welcome"
          title={contextMsg.title}
          message={contextMsg.message}
          actions={[
            {
              id: contextMsg.actionLabel ? "open" : "dismiss",
              label: contextMsg.actionLabel ?? "Got it",
              primary: true,
            },
          ]}
          onAction={handleBubbleAction}
          onClose={() => setDismissedContextId(contextMsg.id)}
        />
      )}

      {open && (
        <AgriBotPanel
          ref={panelRef}
          id={panelId}
          state={state}
          activeTopic={activeTopic}
          onClose={closePanel}
          onPickTopic={pickTopic}
          onFollowUp={handleFollowUp}
        />
      )}

      {!open && (
        <button
          ref={launcherRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label="Open AgriBot assistant"
          onClick={handleToggle}
          className={clsx(
            "relative flex h-14 w-14 items-center justify-center rounded-full",
            "border border-neutral-200 bg-white shadow-lg",
            "transition-all duration-200 ease-out",
            "hover:border-primary-200 hover:shadow-primary",
            "active:bg-neutral-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          )}
        >
          <AgriBotAvatar state={state} size="lg" className="pointer-events-none" />
          <span
            className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-500"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}

export { AGRIBOT_TOPICS };
export type { AgriBotTopic };
