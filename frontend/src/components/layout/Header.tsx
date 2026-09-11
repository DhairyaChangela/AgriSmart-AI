"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { getButtonClassName } from "@/lib/utils/buttonStyles";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/check-crop", label: "Check Crop" },
  { href: "/#how-it-works", label: "How It Works" },
];

export function LeafMark({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-white shadow-sm",
        className
      )}
      aria-hidden="true"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 19C5 9.5 12.5 4 20 4c0 8.5-5 15.5-14 15.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 19c3-5.5 7-9 11-11"
        />
      </svg>
    </span>
  );
}

export function Header({ onMenuClick, isMenuOpen = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-sticky transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm"
          : "bg-white/70 backdrop-blur-sm border-b border-transparent"
      )}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-xl px-2 py-1.5 -ml-2"
            aria-label="AgriSmart AI Home"
          >
            <LeafMark />
            <span className="flex flex-col leading-none">
              <span className="font-semibold text-lg text-neutral-900 tracking-tight">
                AgriSmart AI
              </span>
              <span className="text-xs font-medium text-neutral-500 tracking-wide">
                Crop health, clearly
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href.startsWith("/check-crop")
                    ? pathname === "/check-crop" || pathname.startsWith("/check-crop/")
                    : false;
              return (
<Link
                   key={item.href}
                   href={item.href}
                   aria-current={isActive ? "page" : undefined}
                   className={clsx(
                     "min-h-11 inline-flex items-center px-3 py-2 text-body-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
                     isActive
                       ? "text-primary-800 bg-primary-50"
                       : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                   )}
                 >
                   {item.label}
                 </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center">
            <Link
              href="/check-crop"
              className={getButtonClassName({ size: "lg" })}
            >
              Check your crop
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden flex min-h-11 min-w-11 items-center justify-center rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            onClick={onMenuClick}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
