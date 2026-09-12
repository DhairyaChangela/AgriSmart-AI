"use client";

import { AppShell } from "@/components/layout/AppShell";
import { DiagnosisJourney } from "@/components/journey/DiagnosisJourney";

export default function CheckCropPage() {
  return (
    <AppShell>
      <DiagnosisJourney />
    </AppShell>
  );
}