"use client";

import { useState } from "react";
import { clsx } from "clsx";

export interface ExplanationSectionProps {
  /** One or two plain-language sentences, always visible. */
  explanation: string;
  /** Visible signs behind the result, shown under "Why this result?" */
  observedSigns: string[];
  /**
   * Future ML hook: URL of a real model highlight map (e.g. Grad-CAM).
   * When null, a clearly-marked placeholder is shown instead —
   * we never fabricate heatmaps.
   */
  heatmapUrl?: string | null;
  heatmapAlt?: string;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Plain-language explanation + expandable "Why this result?" section.
 *
 * The visual-evidence slot is backend-ready: pass `heatmapUrl` once the
 * ML team serves real highlight maps and the placeholder swaps out
 * automatically.
 */
export function ExplanationSection({
  explanation,
  observedSigns,
  heatmapUrl,
  heatmapAlt = "Model highlight map showing areas that influenced the analysis",
  defaultOpen = true,
  className,
}: ExplanationSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = "why-this-result-panel";
  const buttonId = "why-this-result-button";

  return (
    <section
      aria-labelledby="explanation-heading"
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6",
        className
      )}
    >
      <h2
        id="explanation-heading"
        className="text-caption text-neutral-500"
      >
        What we found
      </h2>
      <p className="mt-2 text-body text-neutral-800 leading-relaxed">
        {explanation}
      </p>

      <div className="mt-4 border-t border-neutral-100 pt-4">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          <span className="text-base font-semibold text-neutral-900">
            Why this result?
          </span>
          <svg
            aria-hidden="true"
            className={clsx(
              "h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200",
              open && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {open && (
          <div id={panelId} role="region" aria-labelledby={buttonId} className="mt-3 animate-fade-in">
            {observedSigns.length > 0 && (
              <ul role="list" className="space-y-2">
                {observedSigns.map((sign) => (
                  <li key={sign} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500"
                    />
                    <span className="text-body-sm text-neutral-700 leading-relaxed">
                      {sign}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Visual explainability slot — placeholder until ML connects it. */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-neutral-900">
                Areas that influenced the analysis
              </h3>
              {heatmapUrl ? (
                <figure className="mt-2 overflow-hidden rounded-xl border border-neutral-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heatmapUrl}
                    alt={heatmapAlt}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
                    Model highlight map — brighter areas influenced the result more.
                  </figcaption>
                </figure>
              ) : (
                <div
                  role="img"
                  aria-label="Visual explanation preview. Placeholder — no model highlight map is available yet."
                  className="mt-2 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-400 shadow-xs"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </span>
                  <p className="text-sm font-medium text-neutral-700">
                    Visual explanation preview
                  </p>
                  <p className="max-w-sm text-xs leading-relaxed text-neutral-500">
                    A highlight map will appear here once the analysis service
                    provides one. This placeholder is not model output.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
