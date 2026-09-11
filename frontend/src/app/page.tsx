import { AppShell } from "@/components/layout/AppShell";
import { getButtonClassName } from "@/lib/utils/buttonStyles";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Capture",
    description: "Take a clear photo of the affected leaf, in daylight, filling the frame.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Understand",
    description: "AgriSmart AI reads the visible symptoms and explains what it sees — in plain words.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Act",
    description: "Get practical next steps you can do today — and know when to ask an expert.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

const principles = [
  {
    title: "Farmer-first",
    description: "Designed for the field: big touch targets, readable text, and guidance that works on a phone in daylight.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: "Clear explanations",
    description: "No jargon. Every finding is shown where it appears on the leaf, with words anyone can follow.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    title: "Confidence-aware",
    description: "Uncertain results are labelled as uncertain — so you know when a photo needs retaking or an expert should step in.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h4l3 8 4-16 3 8h4" />
      </svg>
    ),
  },
  {
    title: "Made for real photos",
    description: "Built for imperfect field photos — mixed light, busy backgrounds, dusty lenses — not just perfect lab samples.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <AppShell>
      {/* ---------- HERO ---------- */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="field-rows absolute inset-0" />
          <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-100/70 via-primary-50/40 to-transparent" />
          <div className="absolute -top-24 right-[-6rem] h-80 w-80 rounded-full border-[28px] border-primary-100/60" />
          <div className="absolute bottom-[-7rem] left-[-5rem] h-72 w-72 rounded-full border-[24px] border-secondary-100/70" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-14 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 text-caption font-semibold text-primary-800 shadow-xs backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-primary-600" aria-hidden="true" />
              Photo-first crop health helper
            </p>

            <h1
              id="hero-heading"
              className="animate-fade-up-delay-1 mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-6xl"
            >
              Understand your crop.
              <span className="block text-primary-700">Act with confidence.</span>
            </h1>

            <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-xl text-body-lg text-neutral-600 sm:text-xl">
              Photograph a troubled leaf. AgriSmart AI helps you make sense of
              what you see — and what to do next.
            </p>

            <div className="animate-fade-up-delay-2 mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/check-crop"
                className={getButtonClassName({ size: "xl", className: "w-full sm:w-auto sm:min-w-[15rem]" })}
              >
                Check your crop
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </Link>
              <Link
                href="/#how-it-works"
                className={getButtonClassName({ variant: "outline", size: "xl", className: "w-full sm:w-auto" })}
              >
                See how it works
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-body-sm text-neutral-600" role="list">
              <li className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No account needed
              </li>
              <li className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Works on your phone
              </li>
              <li className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Clear next steps
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- PRODUCT STORY ---------- */}
      <section
        id="how-it-works"
        className="bg-white py-16 sm:py-24"
        aria-labelledby="story-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-caption font-semibold text-primary-700">How it works</p>
            <h2 id="story-heading" className="mt-3 text-h1 text-neutral-900">
              From leaf to clear action.
            </h2>
            <p className="mt-4 text-body-lg text-neutral-600">
              One photo moves through three short stages — you always know where you are.
            </p>
          </div>

          <ol className="relative mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6" role="list">
            <div
              className="absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-primary-200 md:block"
              aria-hidden="true"
            />
            {steps.map((step) => (
              <li
                key={step.number}
                className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:shadow-lg sm:p-7"
              >
                <div className="flex items-center gap-4">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-primary">
                    {step.icon}
                  </span>
                  <span className="text-caption font-bold tracking-widest text-primary-400">
                    STEP {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-h3 text-neutral-900">{step.title}</h3>
                <p className="mt-2 text-body text-neutral-600 leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- TRUST / PRINCIPLES ---------- */}
      <section
        className="border-y border-neutral-200 bg-neutral-50 py-16 sm:py-24"
        aria-labelledby="principles-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-caption font-semibold text-primary-700">Why trust it</p>
            <h2 id="principles-heading" className="mt-3 text-h1 text-neutral-900">
              Honest by design.
            </h2>
            <p className="mt-4 text-body-lg text-neutral-600">
              AgriSmart AI would rather say “I’m not sure — retake the photo”
              than guess. These four commitments shape every screen.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-neutral-300 hover:shadow-md"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700"
                  aria-hidden="true"
                >
                  {principle.icon}
                </div>
                <h3 className="mt-4 text-h4 text-neutral-900">{principle.title}</h3>
                <p className="mt-2 text-body-sm text-neutral-600 leading-relaxed">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="bg-white py-16 sm:py-24" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary-950 px-6 py-12 sm:px-12 sm:py-16">
            <div className="absolute inset-0" aria-hidden="true">
              <div
                className="absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 12px)",
                }}
              />
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[22px] border-white/10" />
              <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border-[20px] border-white/10" />
            </div>
            <div className="relative mx-auto max-w-2xl text-center">
              <p className="text-caption font-semibold text-primary-200">Your turn</p>
              <h2 id="cta-heading" className="mt-3 text-h1 text-white">
                Start with one clear photo.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-body-lg text-primary-100">
                Walk to the plant, photograph the worst leaf in daylight, and
                let AgriSmart AI walk you through the rest.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/check-crop"
                  className={getButtonClassName({ size: "xl", className: "w-full bg-white text-primary-900 border border-transparent shadow-lg hover:bg-primary-50 hover:shadow-xl active:bg-primary-100 sm:w-auto sm:min-w-[15rem]" })}
                >
                  Check your crop
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/25 px-8 text-xl font-medium text-white transition-colors hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
                >
                  Revisit the steps
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
