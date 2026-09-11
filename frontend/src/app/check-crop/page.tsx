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
        <CropCapture onContinue={(result) => setLastResult(result)} />

        {lastResult && (
          <div
            role="status"
            className="mx-auto mt-6 w-full max-w-xl rounded-2xl border border-primary-200 bg-primary-50 px-5 py-4"
          >
            <p className="font-semibold text-primary-900">Photo saved for the next step.</p>
            <p className="mt-1 text-sm text-primary-800">
              {lastResult.image.name} is ready. Diagnosis, results, and next actions are out of
              scope for this prototype step.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
