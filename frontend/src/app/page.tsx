import { AppShell } from "@/components/layout/AppShell";
import { getButtonClassName } from "@/lib/utils/buttonStyles";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Capture",
    description: "Take a clear photo of the affected leaf.",
    shortLabel: "Photograph the leaf",
  },
  {
    number: "02",
    title: "Understand",
    description: "AgriSmart AI reads the visible symptoms and explains what it sees.",
    shortLabel: "Get your answer",
  },
  {
    number: "03",
    title: "Act",
    description: "Practical next steps for today — and when to ask an expert.",
    shortLabel: "Know what to do",
  },
];

const trustItems = [
  {
    title: "No account needed",
    description: "Open the app, take a photo, and get an answer. Nothing to install, sign up for, or remember.",
    detail: "Used by farmers with one phone and no login.",
  },
  {
    title: "Honest about uncertainty",
    description: "Low-confidence results say so directly. You decide whether to retake or consult a local expert.",
    detail: "Confidence labels are shown on every result.",
  },
  {
    title: "Works offline to start",
    description: "The photo capture and review flow works without a network connection. Your photo stays on your device until you are ready.",
    detail: "Photo validation runs locally.",
  },
];

function DeviceMockup() {
  return (
    <div
      className="relative mx-auto w-full max-w-[280px] sm:max-w-sm"
      aria-hidden="true"
    >
      <div className="overflow-hidden rounded-[2rem] border-[6px] border-neutral-300 bg-neutral-200 shadow-xl shadow-neutral-300/40">
        <div className="overflow-hidden rounded-[1.25rem] bg-neutral-900 aspect-[9/19]">
          <div className="flex items-center gap-2 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="flex-1 rounded-full bg-neutral-700 px-3 py-1 text-[10px] text-neutral-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-6">
            <div className="h-16 w-16 rounded-2xl bg-primary-700/30 flex items-center justify-center mb-3">
              <svg className="h-8 w-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-xs text-neutral-400 font-medium">leaf-photo.jpg</p>
            <div className="mt-3 w-full rounded-xl bg-primary-700/50 h-20 border border-dashed border-primary-400/30 flex items-center justify-center">
              <div className="field-rows h-full w-full rounded-xl" />
            </div>
            <p className="mt-3 text-[10px] text-neutral-500">Photo captured · Ready</p>
          </div>
          <div className="flex justify-center pb-4 gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
          </div>
        </div>
      </div>
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 rounded-xl bg-white border border-neutral-200 shadow-sm p-2 hidden sm:flex" style={{ boxShadow: "0 4px 14px 0 rgb(45 125 41 / 0.15)" }}>
        <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="absolute -right-6 top-1/3 -translate-y-1/2 rounded-xl bg-white border border-neutral-200 shadow-sm p-2 hidden sm:flex" style={{ boxShadow: "0 4px 14px 0 rgb(45 125 41 / 0.15)" }}>
        <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppShell>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="field-rows absolute inset-0" />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-100/50 via-primary-50/30 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3 py-1.5 text-caption font-semibold text-primary-800 shadow-xs backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" aria-hidden="true" />
              Photo-first crop helper
            </div>

            <h1 id="hero-heading" className="animate-fade-up-delay-1 mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              Your crop looks unwell.{" "}
              <span className="text-primary-700">Let us figure out why.</span>
            </h1>

            <p className="animate-fade-up-delay-2 mx-auto mt-4 max-w-md text-body text-neutral-600 sm:text-lg">
              Photograph a troubled leaf. See what is happening — and what to do next. No account, no login, no guesswork.
            </p>

            <div className="animate-fade-up-delay-2 mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/check-crop" className={getButtonClassName({ size: "xl" })}>
                Check your crop
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </Link>
            </div>

            <p className="mt-4 text-body-sm text-neutral-500">Takes 10 seconds · No signup · Runs on your phone</p>

            <DeviceMockup />

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-body-sm text-neutral-600" role="list">
              <li className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                No account needed
              </li>
              <li className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Works on your phone
              </li>
              <li className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Honest about results
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS — Connected Flow ---------- */}
      <section id="how-it-works" className="bg-white py-10 sm:py-14" aria-labelledby="flow-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-caption font-semibold text-primary-700">How it works</p>
            <h2 id="flow-heading" className="mt-3 text-h2 text-neutral-900">Three steps, one continuous flow.</h2>
            <p className="mt-3 text-body text-neutral-600">From photo to answer, you always know where you are.</p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <ol className="relative" role="list">
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-300 via-primary-400 to-primary-200 hidden md:block" aria-hidden="true" />
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-primary-300 md:hidden" aria-hidden="true" />

              {steps.map((step, i) => (
                <li key={step.number} className="relative pl-12 sm:pl-16">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-white shadow-primary md:h-12 md:w-12" aria-hidden="true">
                      <span className="text-sm font-bold">{step.number}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-caption font-bold tracking-widest text-primary-400">STEP {step.number}</span>
                      <h3 className="mt-0.5 text-h4 text-neutral-900">{step.title}</h3>
                      <p className="mt-1 text-body-sm text-neutral-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="ml-5 mt-2 h-0 w-0.5 bg-primary-200 border-t border-dashed border-primary-200 sm:hidden" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-4">
              <p className="text-body-sm text-primary-900 font-medium">One photo, one answer. The app never asks for personal information, never requires an account, and never analyzes your photos on a server without your consent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRUST ---------- */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-10 sm:py-14" aria-labelledby="trust-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-caption font-semibold text-primary-700">Trust built in</p>
            <h2 id="trust-heading" className="mt-3 text-h2 text-neutral-900">What you can count on.</h2>
            <p className="mt-3 text-body text-neutral-600">These are not promises — they are how the product actually behaves.</p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700" aria-hidden="true">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="mt-4 text-h4 text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-body-sm text-neutral-600 leading-relaxed">{item.description}</p>
                <p className="mt-3 text-xs font-medium text-primary-700">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="bg-white py-10 sm:py-14" aria-labelledby="final-cta-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary-950 px-6 py-10 sm:px-10 sm:py-14">
            <div className="absolute inset-0" aria-hidden="true">
              <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 14px)" }} />
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[18px] border-white/5" />
              <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full border-[16px] border-white/5" />
            </div>
            <div className="relative mx-auto max-w-xl text-center">
              <p className="text-caption font-semibold text-primary-200">Your crop is waiting</p>
              <h2 id="final-cta-heading" className="mt-3 text-h2 text-white">One photo could tell you what to do.</h2>
              <p className="mx-auto mt-3 max-w-md text-body text-primary-100">Pick the worst-looking leaf. Photograph it in daylight. Get clear next steps — and know when to call an expert.</p>
              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/check-crop" className={getButtonClassName({ size: "xl" })}>
                  Check your crop
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" /></svg>
                </Link>
              </div>
              <p className="mt-4 text-xs text-primary-400">No account · No credit card · No commitment</p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
