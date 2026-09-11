"use client";

import { useId } from "react";
import { clsx } from "clsx";
import type { AgriBotState } from "./AgriBotState";

interface AgriBotAvatarProps {
  state: AgriBotState;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

const FACE = "#e8f2e7";
const FACE_DIM = "#cfe6cf";

function expressionClass(active: boolean) {
  return clsx(
    "transition-opacity duration-200 ease-out pointer-events-none",
    active ? "opacity-100" : "opacity-0"
  );
}

export function AgriBotAvatar({ state, size = "md", className }: AgriBotAvatarProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const bodyGradient = `agribot-body-${uid}`;
  const screenGradient = `agribot-screen-${uid}`;

  return (
    <span
      className={clsx("inline-block select-none", sizeClasses[size], className)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full drop-shadow-sm">
        <defs>
          <linearGradient id={bodyGradient} x1="32" y1="12" x2="32" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#eef2ee" />
          </linearGradient>
          <linearGradient id={screenGradient} x1="32" y1="22" x2="32" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#242b27" />
            <stop offset="1" stopColor="#161b18" />
          </linearGradient>
        </defs>

        <g>
          <path
            d="M32 4.2c0 0-5.2 1.6-7.4 4-1 .6-1.1 1.8-.4 2.6l3.6 4.9c.9 1.2 2.9.7 2.9-.7l.2-6.2c0-.5.4-.9.8-.9s.8.4.8.9l.2 6.2c0 1.4 2 1.9 2.9.7l3.6-4.9c.7-.8.6-2-.4-2.6-2.2-2.4-7.4-4-7.4-4z"
            fill="#eef6ee"
            stroke="#3a9d35"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <rect x="8" y="12" width="48" height="44" rx="16" fill={`url(#${bodyGradient})`} stroke="#dfe6df" strokeWidth="1.5" />
          <rect x="9.5" y="13.5" width="45" height="41" rx="14.5" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
          <rect x="16" y="22" width="32" height="18" rx="9" fill={`url(#${screenGradient})`} stroke="#111512" strokeWidth="1" />
        </g>

        <g className={expressionClass(state === "welcome")} fill={FACE}>
          <rect x="21.6" y="27.4" width="5" height="7.4" rx="2.5" />
          <rect x="37.4" y="27.4" width="5" height="7.4" rx="2.5" />
          <path d="M28 37.1c2.4 1.9 5.6 1.9 8 0" stroke={FACE} strokeWidth="1.7" strokeLinecap="round" />
        </g>

        <g className={expressionClass(state === "thinking")} fill={FACE}>
          <circle cx="25.4" cy="30.1" r="2" />
          <circle cx="32" cy="31" r="2" />
          <circle cx="38.6" cy="30.1" r="2" />
          <circle cx="38.6" cy="25.5" r="1.4" opacity="0.85" />
        </g>

        <g className={expressionClass(state === "explaining")} fill={FACE}>
          <circle cx="25.6" cy="31" r="2.4" />
          <circle cx="38.4" cy="31" r="2.4" />
          <path d="M28.2 36.6c2.5 1.5 5.1 1.5 7.6 0" stroke={FACE} strokeWidth="1.6" strokeLinecap="round" />
        </g>

        <g className={expressionClass(state === "loading")} fill={FACE}>
          {[25, 32, 39].map((cx, i) => (
            <circle
              key={cx}
              cx={cx}
              cy="31"
              r="1.7"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </g>

        <g className={expressionClass(state === "success")} stroke={FACE} fill="none" strokeLinecap="round">
          <path d="M21.8 30.4c1.4 2.2 3.8 2.2 5.2 0" strokeWidth="1.8" />
          <path d="M37 30.4c1.4 2.2 3.8 2.2 5.2 0" strokeWidth="1.8" />
          <path d="M26.8 37.4c3.5 2.6 6.9 2.6 10.4 0" strokeWidth="1.7" />
        </g>

        <g className={expressionClass(state === "warning")} fill={FACE}>
          <rect x="21.4" y="29.9" width="6.6" height="2" rx="1" />
          <rect x="36" y="29.9" width="6.6" height="2" rx="1" />
          <path d="M29 37.6c2-1.7 4-1.7 6 0" stroke={FACE_DIM} strokeWidth="1.6" strokeLinecap="round" />
        </g>

        <g className={expressionClass(state === "confused")}>
          <circle cx="25.6" cy="31" r="2.4" fill={FACE} />
          <rect x="36" y="31.6" width="5.6" height="1.7" rx="0.85" fill={FACE} />
          <rect x="37.4" y="27.6" width="3.6" height="1.5" rx="0.75" fill={FACE_DIM} opacity="0.7" />
          <ellipse cx="32" cy="37.4" rx="1.4" ry="1.6" fill="none" stroke={FACE} strokeWidth="1.5" />
        </g>
      </svg>
    </span>
  );
}