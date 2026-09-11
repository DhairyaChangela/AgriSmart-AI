"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { getButtonClassName } from "@/lib/utils/buttonStyles";
import Link from "next/link";
import { LeafMark } from "./Header";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "Home", description: "Start here" },
  { href: "/check-crop", label: "Check Crop", description: "Photograph a leaf" },
  { href: "/#how-it-works", label: "How It Works", description: "Capture → understand → act" },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      const t = window.setTimeout(() => {
        closeRef.current?.focus();
      }, 30);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
      restoreRef.current = null;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="animate-fade-in fixed inset-0 z-modal-backdrop bg-neutral-950/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="mobile-nav"
        className="animate-drawer-in fixed inset-y-0 right-0 z-modal w-full max-w-sm bg-white shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-xl px-2 py-1.5"
            onClick={onClose}
            aria-label="AgriSmart AI Home"
          >
            <LeafMark />
            <span className="font-semibold text-lg text-neutral-900 tracking-tight">
              AgriSmart AI
            </span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4 px-4 overflow-y-auto" role="navigation" aria-label="Mobile navigation">
          <ul className="space-y-1" role="list">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href.startsWith("/check-crop")
                    ? pathname === "/check-crop" || pathname.startsWith("/check-crop/")
                    : false;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(
                      "flex w-full items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
                      isActive
                        ? "bg-primary-50 text-primary-900"
                        : "text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200"
                    )}
                  >
                    <span>
                      <span className="block text-body font-semibold">{item.label}</span>
                      <span className="block text-body-sm text-neutral-500">{item.description}</span>
                    </span>
                    <svg className="h-5 w-5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-neutral-200 p-4 space-y-3 bg-neutral-50/60">
          <Link
            href="/check-crop"
            onClick={onClose}
            className={getButtonClassName({ size: "xl", className: "w-full" })}
          >
            Check your crop
          </Link>
          <p className="text-center text-body-sm text-neutral-500">
            No account needed · Works on your phone
          </p>
        </div>
      </aside>
    </>
  );
}
