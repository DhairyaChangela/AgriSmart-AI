"use client";

import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";

const STEP_DURATION_MS = 6000;

const TUTORIAL_STEPS = [
  {
    key: "capture",
    label: "Take a photo",
    caption: "Center one leaf in the frame, then tap Capture.",
  },
  {
    key: "review",
    label: "Review it",
    caption: "Check the photo is clear before the app explains anything.",
  },
  {
    key: "result",
    label: "See what's next",
    caption: "Plain-language next steps — and when to ask an expert.",
  },
] as const;

function MiniLeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19C5 9.5 12.5 4 20 4c0 8.5-5 15.5-14 15.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19c3-5.5 7-9 11-11" />
    </svg>
  );
}

function MiniCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function MiniArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SampleLeafPhoto() {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="heroleafbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef6ec" />
          <stop offset="100%" stopColor="#dceee0" />
        </linearGradient>
        <linearGradient id="heroleafbody" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#5aa558" />
          <stop offset="100%" stopColor="#387a3f" />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill="url(#heroleafbg)" />
      <path
        d="M160 30 C 225 34 258 82 250 130 C 243 172 196 190 140 186 C 92 182 74 152 80 112 C 86 74 118 30 160 30 Z"
        fill="url(#heroleafbody)"
      />
      <path d="M158 36 C 163 90 160 145 152 178" stroke="#2a5c32" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65" />
      <path d="M159 62 C 175 56 196 60 214 70" stroke="#2a5c32" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M157 96 C 176 90 199 94 218 106" stroke="#2a5c32" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M156 126 C 138 120 118 123 101 133" stroke="#2a5c32" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
      <ellipse cx="198" cy="112" rx="10" ry="8" fill="#8a5b3a" opacity="0.85" />
      <ellipse cx="176" cy="142" rx="6" ry="5" fill="#8a5b3a" opacity="0.8" />
      <ellipse cx="128" cy="96" rx="7" ry="5" fill="#8a5b3a" opacity="0.8" />
    </svg>
  );
}

interface ScreenProps {
  active: boolean;
}

function StatusRow({ light = false }: { light?: boolean }) {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-between px-6 pt-3",
        light ? "text-white" : "text-neutral-900"
      )}
      aria-hidden="true"
    >
      <span className="text-[11px] font-semibold tracking-wide">9:41</span>
      <span className="absolute left-1/2 top-2.5 h-[19px] w-[84px] -translate-x-1/2 rounded-full bg-neutral-950" />
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <svg className="h-2.5 w-4" viewBox="0 0 16 10" fill="currentColor" aria-hidden="true">
          <rect x="0" y="7" width="2.5" height="3" rx="0.75" opacity="0.4" />
          <rect x="4" y="5" width="2.5" height="5" rx="0.75" opacity="0.55" />
          <rect x="8" y="3" width="2.5" height="7" rx="0.75" opacity="0.75" />
          <rect x="12" y="1" width="2.5" height="9" rx="0.75" />
        </svg>
        <svg className="h-2.5 w-5" viewBox="0 0 20 10" fill="currentColor" aria-hidden="true">
          <rect x="0" y="4" width="13" height="4" rx="1.2" stroke="currentColor" strokeWidth="0.75" fill="none" />
          <rect x="1" y="5" width="8" height="2" rx="0.6" />
          <path d="M14 2.5c2.6 1.4 2.6 4.6 0 6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function AppHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between px-5 pb-1 pt-2.5" aria-hidden="true">
      <span className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-700 text-white">
          <MiniLeafIcon className="h-3.5 w-3.5" />
        </span>
        <span className="text-[13px] font-semibold tracking-tight text-neutral-900">{title}</span>
      </span>
      {badge && (
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-neutral-600">
          {badge}
        </span>
      )}
    </div>
  );
}

function CaptureScreen({ active }: ScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-neutral-950 text-white">
      <StatusRow light />
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-1">
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <span className="absolute left-0 top-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/85" aria-hidden="true">
            Photo tips only
          </span>
          <div className="flex aspect-square w-[58%] flex-col items-center justify-center gap-2 rounded-[1.9rem] border-2 border-dashed border-white/55" aria-hidden="true">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <MiniLeafIcon className="h-6 w-6 text-white/90" />
            </span>
            <span className="text-[10px] font-medium tracking-wide text-white/70">One leaf in frame</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className={clsx("rounded-2xl", active && "ring-2 ring-primary-500 ring-offset-2 ring-offset-neutral-950")}>
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3 text-[13px] font-semibold text-white" aria-hidden="true">
              <CameraIcon className="h-4 w-4" />
              Capture photo
            </div>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-neutral-400" aria-hidden="true">
            <MiniCheckIcon className="h-3 w-3 text-primary-400" />
            Sample camera view — moves you to review
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewScreen({ active }: ScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-neutral-900">
      <StatusRow />
      <AppHeader title="Check your crop" badge="Step 2 of 3" />
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-4 pt-2">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200" aria-hidden="true">
          <div className="aspect-[16/10] w-full bg-neutral-100">
            <SampleLeafPhoto />
          </div>
          <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-neutral-800 shadow-sm">
            leaf-photo.jpg
          </span>
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-1 text-[10px] font-semibold text-success-700">
            <MiniCheckIcon className="h-3 w-3" />
            Selected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2" aria-hidden="true">
          <span className="flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-2 py-2.5 text-[10px] font-medium text-neutral-700">
            <MiniCheckIcon className="h-3 w-3 shrink-0 text-success-600" />
            One leaf
          </span>
          <span className="flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-2 py-2.5 text-[10px] font-medium text-neutral-700">
            <MiniCheckIcon className="h-3 w-3 shrink-0 text-success-600" />
            Bright and clear
          </span>
        </div>

        <div className="mt-auto space-y-2">
          <div className={clsx("rounded-2xl", active && "ring-2 ring-primary-500 ring-offset-2")}>
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3 text-[13px] font-semibold text-white" aria-hidden="true">
              <MiniCheckIcon className="h-4 w-4" />
              Looks good — Continue
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-neutral-500" aria-hidden="true">
            Sample preview — a clear photo helps later.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ active }: ScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-neutral-900">
      <StatusRow />
      <AppHeader title="Result" badge="Sample" />
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-4 pt-2">
        <div className="overflow-hidden rounded-2xl border border-neutral-200" aria-hidden="true">
          <div className="flex items-center gap-3 p-3">
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-100">
              <SampleLeafPhoto />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold tracking-tight text-neutral-900">
                Likely: leaf spot
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-neutral-500">
                Small, brown, roughly circular spots on the leaf.
              </span>
            </span>
          </div>
          <div className="border-t border-neutral-100 px-3 py-2.5">
            <p className="text-[10px] font-semibold text-neutral-500">What the app would explain</p>
            <ul className="mt-1.5 space-y-1.5">
              <li className="flex items-start gap-1.5 text-[10px] leading-snug text-neutral-600">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                Spots sit between the leaf veins
              </li>
              <li className="flex items-start gap-1.5 text-[10px] leading-snug text-neutral-600">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                Leaf edges look otherwise healthy
              </li>
              <li className="flex items-start gap-1.5 text-[10px] leading-snug text-neutral-600">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                Likely to spread in damp weather
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/60 px-3 py-2">
            <span className="text-[10px] font-medium text-neutral-500">Confidence</span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
              </span>
              <span className="text-[10px] font-semibold text-accent-700">Medium</span>
            </span>
          </div>
          <p className="border-t border-neutral-100 px-3 py-2 text-center text-[9px] text-neutral-400">
            Sample result · no real analysis ran
          </p>
        </div>

        <div className={clsx("mt-auto rounded-2xl border border-primary-100 bg-primary-50/70 p-3", active && "ring-2 ring-primary-500 ring-offset-2")}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary-800" aria-hidden="true">
            What to do next
          </p>
          <ul className="mt-2 space-y-2" role="list">
            <li className="flex items-center gap-2 text-[11px] font-medium text-neutral-800">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                <MiniArrowRightIcon className="h-2.5 w-2.5" />
              </span>
              Remove the worst leaves
            </li>
            <li className="flex items-center gap-2 text-[11px] font-medium text-neutral-800">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                <MiniArrowRightIcon className="h-2.5 w-2.5" />
              </span>
              Ask your local advisor for a second opinion
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const SCREENS = [CaptureScreen, ReviewScreen, ResultScreen];

function StepNav({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div aria-label="Walkthrough steps" className="flex items-center gap-1">
      {TUTORIAL_STEPS.map((step, i) => (
        <button
          key={step.key}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Step ${i + 1}: ${step.label}${i === activeIndex ? " (current)" : ""}`}
          aria-current={i === activeIndex ? "step" : undefined}
          className="flex items-center justify-center rounded-full p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full transition-colors",
              i === activeIndex ? "bg-primary-700" : "bg-neutral-300 hover:bg-neutral-400"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function AutoProgress({
  active,
  reducedMotion,
  onComplete,
}: {
  active: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active || reducedMotion) return;
    const start = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / STEP_DURATION_MS) * 100));
      if (elapsed >= STEP_DURATION_MS) onComplete();
    }, 100);
    return () => window.clearInterval(timer);
  }, [active, reducedMotion, onComplete]);

  if (reducedMotion) return null;

  return (
    <div className="h-0.5 w-28 overflow-hidden rounded-full bg-neutral-200" aria-hidden="true">
      <div className="h-full rounded-full bg-primary-600" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function HeroTutorial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const advance = useCallback(() => {
    setActiveIndex((current) => (current + 1) % TUTORIAL_STEPS.length);
  }, []);

  const selectStep = (index: number) => {
    setActiveIndex(index);
  };

  const ActiveScreen = SCREENS[activeIndex];

  return (
    <div
      role="group"
      aria-label="Guided product walkthrough. Illustrative sample only — it never runs a real analysis."
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative mx-auto w-full max-w-[268px] sm:max-w-[300px] lg:max-w-[320px]"
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -bottom-3 left-1/2 h-4 w-3/5 -translate-x-1/2 rounded-[100%] bg-neutral-900/25 blur-md"
        />

        <div className="relative rounded-[2.9rem] bg-gradient-to-b from-neutral-600 via-neutral-900 to-neutral-950 p-[5px] shadow-[0_28px_50px_-12px_rgba(0,0,0,0.4),0_10px_18px_-6px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute inset-px rounded-[2.9rem] ring-1 ring-white/15" aria-hidden="true" />

          <div className="absolute -left-[3px] top-[20%] h-8 w-[3px] rounded-l-md bg-neutral-600" aria-hidden="true" />
          <div className="absolute -left-[3px] top-[28%] h-12 w-[3px] rounded-l-md bg-neutral-600" aria-hidden="true" />
          <div className="absolute -right-[3px] top-[22%] h-16 w-[3px] rounded-r-md bg-neutral-600" aria-hidden="true" />

          <div className="relative overflow-hidden rounded-[2.4rem] bg-black">
            <div className="flex aspect-[9/19] flex-col">
              <div key={activeIndex} className="animate-fade-in flex min-h-0 flex-1 flex-col">
                <ActiveScreen active={true} />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-[2.4rem] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent"
            />
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Step {activeIndex + 1} of 3: {TUTORIAL_STEPS[activeIndex].label}.{" "}
        {TUTORIAL_STEPS[activeIndex].caption}
      </p>

      <div className="mt-4 flex flex-col items-center gap-2">
        <StepNav activeIndex={activeIndex} onSelect={selectStep} />
        <AutoProgress
          key={activeIndex}
          active={!paused}
          reducedMotion={reducedMotion}
          onComplete={advance}
        />
      </div>
      <p className="mt-2 text-center text-xs text-neutral-500">
        Illustrative walkthrough — not a real diagnosis.
      </p>
    </div>
  );
}
