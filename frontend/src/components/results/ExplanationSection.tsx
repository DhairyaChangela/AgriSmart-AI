"use client";

import { useId, useState } from "react";
import { clsx } from "clsx";

export interface ExplanationSectionProps {
  whatWeSee: string[];
  why: string;
  className?: string;
}

export function ExplanationSection({ whatWeSee, why, className }: ExplanationSectionProps) {
  const [whyOpen, setWhyOpen] = useState(false);
  const whyId = useId();

  return (
    <section className={clsx("space-y-4", className)} aria-labelledby="explanation-heading">
      <h2 id="explanation-heading" className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
        What we see
      </h2>
      <ul className="space-y-2" role="list">
        {whatWeSee.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-neutral-800">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <div className="border-t border-neutral-200 pt-3">
        <button
          type="button"
          aria-expanded={whyOpen}
          aria-controls={whyId}
          onClick={() => setWhyOpen((o) => !o)}
          className="inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-1 text-left text-sm font-semibold text-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          Why this label?
          <svg
            className={clsx("h-4 w-4 shrink-0 text-neutral-500 transition-transform", whyOpen && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {whyOpen && (
          <p id={whyId} className="mt-2 text-sm leading-relaxed text-neutral-600">
            {why}
          </p>
        )}
      </div>
    </section>
  );
}
