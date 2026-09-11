"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Header, LeafMark } from "./Header";
import { MobileNav } from "./MobileNav";
import { AgriBot } from "@/components/assistant/AgriBot";
import { PointerAccent } from "@/components/ui/PointerAccent";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-toast focus:rounded-xl focus:bg-primary-700 focus:px-4 focus:py-2.5 focus:text-white focus:text-body-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <Header
        onMenuClick={() => setMobileNavOpen((open) => !open)}
        isMenuOpen={mobileNavOpen}
      />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <main className="flex-1 pt-16" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="border-t border-neutral-200 bg-white" role="contentinfo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-xl px-2 py-1.5 -ml-2"
                aria-label="AgriSmart AI Home"
              >
                <LeafMark />
                <span className="font-semibold text-lg text-neutral-900 tracking-tight">
                  AgriSmart AI
                </span>
              </Link>
              <p className="text-body-sm text-neutral-600 max-w-xs leading-relaxed">
                Photo-first crop health guidance — built for the field, written in plain language.
              </p>
              <p className="text-body-sm text-neutral-500 max-w-xs">
                Foundation build: shell and homepage only. Diagnosis and the assistant arrive in later phases.
              </p>
            </div>
            <nav aria-label="Product">
              <h2 className="text-caption text-neutral-500 mb-4">Product</h2>
              <ul className="space-y-3" role="list">
                <li>
                  <Link href="/check-crop" className="text-body-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded">
                    Check your crop
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="text-body-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-body-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded">
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="What to expect">
              <h2 className="text-caption text-neutral-500 mb-4">What to expect</h2>
              <ul className="space-y-3 text-body-sm text-neutral-600" role="list">
                <li>Clear photo guidance</li>
                <li>Honest confidence levels</li>
                <li>Plain-language next steps</li>
              </ul>
            </nav>
          </div>
          <div className="mt-10 pt-6 border-t border-neutral-200">
            <p className="text-body-sm text-neutral-500">
              &copy; {new Date().getFullYear()} AgriSmart AI. Prototype interface — no medical or agronomic certification implied.
            </p>
          </div>
        </div>
      </footer>
      <AgriBot />
      <PointerAccent />
    </div>
  );
}
