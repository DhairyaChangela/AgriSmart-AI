import { AppShell } from "@/components/layout/AppShell";
import { getButtonClassName } from "@/lib/utils/buttonStyles";
import Link from "next/link";

const flowSteps = [
  {
    number: "01",
    title: "Capture",
    description: "Photograph or upload one clear leaf — the same screen you use in the field.",
    hint: "Blur and lighting checks run on your phone before you continue.",
  },
  {
    number: "02",
    title: "Understand",
    description: "After capture, analysis explains visible symptoms in plain language (diagnosis screen in a later phase).",
    hint: "Planned: every answer shows a confidence level so you know when to trust it.",
  },
  {
    number: "03",
    title: "Act",
    description: "You receive practical steps for today and a clear signal when to call an expert.",
    hint: "AgriBot helps you read results — it guides, it does not diagnose on its own.",
  },
] as const;

const trustPoints = [
  {
    term: "No account to start",
    detail:
      "Open Check your crop, take a photo, and continue. Nothing to install beyond your browser.",
  },
  {
    term: "Your photo stays with you",
    detail:
      "This build validates and previews on your device. Analysis is not run automatically without you choosing to continue.",
  },
  {
    term: "Confidence shown openly",
    detail:
      "When results arrive, low confidence is labeled clearly — retake or ask a local agronomist.",
  },
] as const;

function LeafThumbnail() {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-gradient-to-br from-primary-100 via-primary-50 to-amber-50"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full text-primary-700/25" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice">
        <path
          fill="currentColor"
          d="M160 28c-52 38-88 92-96 148 24-18 52-28 96-28s72 10 96 28c-8-56-44-110-96-148z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M160 148V48M160 148c-28-12-48-32-62-58M160 148c28-12 48-32 62-58"
        />
        <ellipse cx="118" cy="132" rx="14" ry="10" fill="rgb(180 83 9 / 0.35)" />
        <ellipse cx="198" cy="118" rx="11" ry="8" fill="rgb(180 83 9 / 0.28)" />
      </svg>
    </div>
  );
}

/** Mirrors the check-crop capture UI so the homepage feels like the product, not a poster. */
function CaptureProductPreview() {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
      <div className="surface-raised overflow-hidden shadow-md">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-100 bg-neutral-50 px-3 py-2.5 sm:px-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700">Step 1 of 3</p>
          <p className="truncate text-xs font-medium text-neutral-600">Check your crop</p>
        </div>

        <nav className="flex items-center justify-between gap-1 px-3 py-3 sm:px-4" aria-hidden="true">
          {(["Choose", "Capture", "Review"] as const).map((label, i) => {
            const active = i === 2;
            const done = i < 2;
            return (
              <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-primary-700 text-white shadow-sm"
                      : done
                        ? "bg-primary-100 text-primary-800"
                        : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`text-[10px] font-medium sm:text-xs ${active ? "text-primary-800" : "text-neutral-500"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-neutral-100">
          <div className="relative aspect-[4/3] w-full bg-neutral-100">
            <LeafThumbnail />
          </div>
          <div className="space-y-3 p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900">field-leaf.jpg</p>
                <p className="mt-0.5 text-xs text-neutral-500">1.2 MB · ready on your phone</p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700">
                Selected
              </span>
            </div>
            <div className="rounded-xl border border-success-200 bg-success-50 px-3 py-2.5 text-left">
              <p className="text-xs font-semibold text-success-800">Photo looks clear enough to continue</p>
              <p className="mt-0.5 text-[11px] leading-snug text-success-900/80">
                Validation runs locally — same flow as the live capture screen.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700">
                Replace
              </span>
              <span className="inline-flex h-11 flex-[1.2] items-center justify-center rounded-xl bg-primary-600 text-sm font-semibold text-white shadow-sm">
                Continue
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-neutral-500 sm:text-xs">
        This is the real capture screen — tap below to open it on your phone.
      </p>
    </div>
  );
}

function FlowConnector({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <AppShell>
      {/* Hero — product-first, one primary action */}
      <section className="border-b border-neutral-200/80 bg-white" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-10 lg:px-8 lg:py-12">
          <div className="max-w-xl lg:max-w-none">
            <p className="text-caption font-semibold text-primary-700">AgriSmart AI</p>
            <h1
              id="hero-heading"
              className="mt-2 text-[1.625rem] font-bold leading-[1.2] tracking-tight text-neutral-900 sm:text-3xl lg:text-[2rem] lg:leading-[1.15]"
            >
              One leaf photo. A plain answer about what might be wrong.
            </h1>
            <p className="mt-3 text-body-sm leading-relaxed text-neutral-600 sm:text-base">
              Built for farmers in the field: photograph the worst-looking leaf, see what the app notices, and know what to
              try next — without signing up first.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/check-crop"
                className={getButtonClassName({ size: "lg", fullWidth: true, className: "sm:w-auto sm:min-w-[12.5rem]" })}
              >
                Photograph a leaf
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-primary-700 underline-offset-4 hover:bg-primary-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 sm:w-auto"
              >
                See the three steps
              </Link>
            </div>

            <ul className="mt-5 flex flex-col gap-2 text-body-sm text-neutral-600 sm:flex-row sm:flex-wrap sm:gap-x-4" role="list">
              <li className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Works in your mobile browser
              </li>
              <li className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Photo stays on your device in this build
              </li>
            </ul>
          </div>

          <div className="mt-8 lg:mt-0">
            <CaptureProductPreview />
          </div>
        </div>
      </section>

      {/* How it works — one connected journey */}
      <section id="how-it-works" className="bg-neutral-50 py-8 sm:py-10" aria-labelledby="flow-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 id="flow-heading" className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
              Capture → Understand → Act
            </h2>
            <p className="mt-2 text-body-sm text-neutral-600 sm:text-base">
              Three steps on one path. You always know which step you are on and what happens next.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <ol className="grid md:grid-cols-3 md:divide-x md:divide-neutral-200" role="list">
              {flowSteps.map((step, index) => (
                <li key={step.number} className="relative flex flex-col p-4 sm:p-5">
                  {index < flowSteps.length - 1 && (
                    <div
                      className="pointer-events-none absolute bottom-0 left-1/2 hidden h-8 w-px -translate-x-1/2 translate-y-full bg-primary-200 md:hidden"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
                      {step.number}
                    </span>
                    <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">{step.title}</h3>
                    {index < flowSteps.length - 1 && (
                      <FlowConnector className="ml-auto hidden h-5 w-5 text-primary-400 md:block" />
                    )}
                  </div>
                  <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">{step.description}</p>
                  <p className="mt-auto pt-3 text-xs font-medium leading-snug text-primary-800">{step.hint}</p>
                  {index < flowSteps.length - 1 && (
                    <div className="mt-4 border-t border-dashed border-neutral-200 pt-4 md:hidden" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Trust — honest, product-backed statements */}
      <section className="border-y border-neutral-200 bg-white py-8 sm:py-10" aria-labelledby="trust-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="trust-heading" className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            What this app actually does today
          </h2>
          <p className="mt-2 max-w-2xl text-body-sm text-neutral-600 sm:text-base">
            No marketing fluff — each point matches the current prototype and the experience we are building toward.
          </p>

          <dl className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
            {trustPoints.map((item) => (
              <div key={item.term} className="grid gap-1 px-4 py-4 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-6 sm:px-5 sm:py-4">
                <dt className="text-sm font-semibold text-neutral-900">{item.term}</dt>
                <dd className="text-body-sm leading-relaxed text-neutral-600">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Closing — prepare for the field, not a repeat of the hero */}
      <section className="bg-neutral-50 py-8 sm:py-10" aria-labelledby="final-cta-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl rounded-2xl border border-primary-200 bg-white p-5 sm:p-7">
            <h2 id="final-cta-heading" className="text-lg font-bold text-neutral-900 sm:text-xl">
              Before you walk to the field
            </h2>
            <p className="mt-2 text-body-sm text-neutral-600">
              Thirty seconds of prep makes the photo useful. Then you are done until you choose to continue.
            </p>
            <ol className="mt-4 space-y-3 text-body-sm text-neutral-700" role="list">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 text-xs font-bold text-primary-800">
                  1
                </span>
                <span>Pick the worst-looking leaf and hold the phone steady in daylight.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 text-xs font-bold text-primary-800">
                  2
                </span>
                <span>Follow the on-screen blur and framing tips — they run on your phone.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 text-xs font-bold text-primary-800">
                  3
                </span>
                <span>When you are ready, continue to the next step in the flow (diagnosis ships in a later phase).</span>
              </li>
            </ol>
            <Link
              href="/check-crop"
              className={getButtonClassName({ size: "lg", fullWidth: true, className: "mt-6" })}
            >
              Open capture screen
            </Link>
            <p className="mt-3 text-center text-xs text-neutral-500">Prototype — not a certified agronomic diagnosis</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
