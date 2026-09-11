"use client";

import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

const badgeStyles = {
  base: `
    inline-flex items-center gap-1.5
    font-medium rounded-full
    transition-colors duration-200
  `,
  variants: {
    default: "bg-neutral-100 text-neutral-700",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-success-50 text-success-700 border border-success-100",
    warning: "bg-warning-50 text-warning-700 border border-warning-100",
    error: "bg-error-50 text-error-700 border border-error-100",
    info: "bg-info-50 text-info-700 border border-info-100",
  },
  sizes: {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  },
  dot: "relative pl-5 before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full",
};

const dotColors = {
  default: "before:bg-neutral-400",
  primary: "before:bg-primary-500",
  secondary: "before:bg-secondary-500",
  success: "before:bg-success-500",
  warning: "before:bg-warning-500",
  error: "before:bg-error-500",
  info: "before:bg-info-500",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        badgeStyles.base,
        badgeStyles.variants[variant],
        badgeStyles.sizes[size],
        dot && badgeStyles.dot,
        dot && dotColors[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface StatusBadgeProps {
  status: "idle" | "pending" | "processing" | "success" | "warning" | "error" | "unknown";
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

const statusConfig = {
  idle: { label: "Ready", variant: "default" as const, dot: false },
  pending: { label: "Pending", variant: "info" as const, dot: true },
  processing: { label: "Processing", variant: "primary" as const, dot: true },
  success: { label: "Success", variant: "success" as const, dot: false },
  warning: { label: "Warning", variant: "warning" as const, dot: false },
  error: { label: "Error", variant: "error" as const, dot: false },
  unknown: { label: "Unknown", variant: "secondary" as const, dot: false },
};

export function StatusBadge({ status, size = "md", showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size={size} dot={showDot && config.dot}>
      {config.label}
    </Badge>
  );
}