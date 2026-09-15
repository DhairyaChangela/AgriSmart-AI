"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { clsx } from "clsx";
import { AgriBotAvatar } from "./AgriBotAvatar";
import { AgriBotPanel, type AgriBotFollowUpId } from "./AgriBotPanel";
import { AGRIBOT_TOPICS, type AgriBotState, type AgriBotTopic } from "./AgriBotState";
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
  const [contextMsg, setContextMsg] = useState<AgriBotContextMessage | null>(() =>
    getAgriBotContext()
  );

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timerIdsRef = useRef<number[]>([]);

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
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleContextChange = useCallback((msg: AgriBotContextMessage | null) => {
    setContextMsg(msg);
  }, []);

useEffect(() => subscribeAgriBotContext(handleContextChange), [handleContextChange]);

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

  const handleToggle = useCallback(() => {
    if (open) {
      closePanel();
    } else {
      openPanel();
    }
  }, [open, closePanel, openPanel]);

  return (
    <div className={clsx("fixed right-3 bottom-3 z-[300] sm:right-5 sm:bottom-5", className)}>
      {open && (
        <AgriBotPanel
          ref={panelRef}
          id={panelId}
          state={state}
          activeTopic={activeTopic}
          contextMessage={contextMsg?.message ?? null}
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
