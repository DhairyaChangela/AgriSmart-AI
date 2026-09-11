"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CropCapture } from "@/components/camera";
import type { CaptureResult } from "@/components/camera";

export default function CheckCropPage() {
  const [lastResult, setLastResult] = useState<CaptureResult | null>(null);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-700">
            Step 1 of 3
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Check your crop
          </h1>
          <p className="mx-auto mt-2 max-w-md text-base text-neutral-600">
            One photo. One clear answer. One clear next action.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-xs text-primary-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Your photo stays on your phone — no automatic analysis
          </div>
        </div>

        <CropCapture onContinue={(result) => setLastResult(result)} />

        {lastResult && (
          <div
            role="status"
            className="mx-auto mt-6 w-full max-w-xl rounded-2xl border border-success-200 bg-success-50 px-5 py-4"
          >
            <p className="font-semibold text-success-700">Photo saved for the next step.</p>
            <p className="mt-1 text-sm text-success-800">
              {lastResult.image.name} is ready. Diagnosis, results, and next actions are out of
              scope for this prototype step.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
