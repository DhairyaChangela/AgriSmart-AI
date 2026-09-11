"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

interface AgriBotProps {
  className?: string;
}

export function AgriBot({ className }: AgriBotProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AgriBotState>("welcome");
  const [activeTopic, setActiveTopic] = useState<AgriBotTopic | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const hasOpenedRef = useRef(false);

  const clearTimer = useCallback((id: number | undefined) => {
    if (id !== undefined) {
      window.clearTimeout(id);
      timersRef.current = timersRef.current.filter((t) => t !== id);
    }
  }, []);

  const openPanel = useCallback(() => {
    hasOpenedRef.current = true;
    setBubbleDismissed(true);
    setShowBubble(false);
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open || bubbleDismissed || hasOpenedRef.current) return;
    const id = window.setTimeout(() => setShowBubble(true), 1400);
    timersRef.current.push(id);
    return () => clearTimer(id);
  }, [open, bubbleDismissed, clearTimer]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => panelRef.current?.focus(), 160);
      timersRef.current.push(id);
    } else {
      launcherRef.current?.focus();
    }
  }, [open]);

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
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const pickTopic = useCallback((topic: AgriBotTopic) => {
    setBubbleDismissed(true);
    setShowBubble(false);
    hasOpenedRef.current = true;
    setActiveTopic(topic);
    setState("thinking");
    setOpen(true);
    const id = window.setTimeout(() => setState("explaining"), 900);
    timersRef.current.push(id);
  }, []);

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
      setBubbleDismissed(true);
      setShowBubble(false);
      if (id === "open") {
        openPanel();
      }
    },
    [openPanel]
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
      {showBubble && (
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
            setBubbleDismissed(true);
            setShowBubble(false);
          }}
        />
      )}

      {open && (
        <AgriBotPanel
          ref={panelRef}
          id="agribot-panel"
          state={state}
          activeTopic={activeTopic}
          onClose={closePanel}
          onPickTopic={pickTopic}
          onFollowUp={handleFollowUp}
        />
      )}

      <button
        ref={launcherRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="agribot-panel"
        aria-label={open ? "Close AgriBot assistant" : "Open AgriBot assistant"}
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
    </div>
  );
}

export { AGRIBOT_TOPICS };
export type { AgriBotTopic };