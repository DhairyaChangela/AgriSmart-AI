import { clsx } from "clsx";

const buttonStyles = {
  base: `
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-200 ease-out
    rounded-xl focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-primary-500 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `,
  variants: {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 active:bg-primary-800
      shadow-sm hover:shadow-md
      border border-transparent
    `,
    secondary: `
      bg-secondary-100 text-secondary-900
      hover:bg-secondary-200 active:bg-secondary-300
      border border-transparent
    `,
    outline: `
      bg-transparent text-primary-600
      border-2 border-primary-600
      hover:bg-primary-50 active:bg-primary-100
    `,
    ghost: `
      bg-transparent text-primary-600
      hover:bg-primary-50 active:bg-primary-100
      border border-transparent
    `,
    destructive: `
      bg-error-500 text-white
      hover:bg-error-600 active:bg-error-700
      shadow-sm hover:shadow-md
      border border-transparent
    `,
  },
  sizes: {
sm: `
       h-11 px-3.5 text-sm gap-1.5
     `,
    md: `
      h-11 px-4 text-base gap-2
    `,
    lg: `
      h-12 px-6 text-lg gap-2.5
    `,
    xl: `
      h-14 px-8 text-xl gap-3
    `,
  },
  fullWidth: "w-full",
  loading: "cursor-wait",
};

export interface ButtonStyleProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
}

export function getButtonClassName(props: ButtonStyleProps) {
  const { variant = "primary", size = "md", fullWidth = false, loading = false, className } = props;
  return clsx(
    buttonStyles.base,
    buttonStyles.variants[variant],
    buttonStyles.sizes[size],
    fullWidth && buttonStyles.fullWidth,
    loading && buttonStyles.loading,
    className
  );
}