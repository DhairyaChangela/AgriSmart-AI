"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CropCapture } from "@/components/camera";
import type { CaptureResult } from "@/components/camera";

export default function CheckCropPage() {
  const router = useRouter();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-5 border-b border-neutral-200 pb-4">
          <p className="text-caption font-semibold text-primary-700">Capture</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">Check your crop</h1>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">
            Photograph one leaf, review it, then continue to analysis when you are ready.
          </p>
          <p className="mt-2 text-xs text-neutral-500">Your photo stays on this device until you choose to continue.</p>
        </header>

        <CropCapture
          onContinue={(result: CaptureResult) => {
            try {
              sessionStorage.setItem("agrismart:capturePreview", result.image.previewUrl);
            } catch {
              /* sessionStorage may be unavailable */
            }
            router.push("/results?demo=moderate");
          }}
        />
      </div>
    </AppShell>
  );
}
